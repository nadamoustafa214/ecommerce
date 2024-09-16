import cloudinary from './../../../utils/cloudinary.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import slugify from 'slugify'

export const createCategory=async (req,res,next)=>{
    const {name}=req.body
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
const category=await categoryModel.create({name,image:{secure_url,public_id},slug:slugify(name,'-')})
return res.status(201).json({message:'created',category})
}

export const updateCateory=async (req,res,next)=>{

    const {name}=req.body
    let image;
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
        image={public_id,secure_url}
    }
    const category = await categoryModel.findByIdAndUpdate({_id:req.params.categoryId},{name:req.body.name,image,slug:slugify(name,'-')})
    if(!category){
        return next(new Error('category not found',{cause:400}))
    }
    return res.status(200).json({message:'updated',category})
}

export const deleteCategory=async (req,res,next)=>{

    const category=await categoryModel.findByIdAndUpdate({_id:req.params.categoryId},{isDeleted:true})
    await cloudinary.uploader.destroy(category.image.secure_url,category.image.public_id)
    if(!category){
        return next(new Error('category not found'),{cause:400})
    }
    return res.status(200).json({message:"done"})
}

export const getAllCatigories=async (req,res,next)=>{
    const catigores=await categoryModel.find({isDeleted:false}).select('name slug image')
    if(!catigores){
        return next(new Error('no catigores found',{cause:400}))
    }
    return res.status(200).json({message:"done",catigores})
}

export const getOneCategory=async (req,res,next)=>{

        const category=await categoryModel.findById({_id:req.params.categoryId}).select('name slug image')
        if(!category &&category.isDeleted==true){
            return next(new Error('category not found',{cause:400}))
        }
        return res.status(200).json({message:'done',category})


}