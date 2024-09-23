import cloudinary from './../../../utils/cloudinary.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import slugify from 'slugify'

export const createCategory=async (req,res,next)=>{
const {name}=req.body
if(await categoryModel.findOne({name:name})){
return next(new Error('category name already exist',{cause:400}))
}
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
const category=await categoryModel.create({name,image:{secure_url,public_id},slug:slugify(name,'-'),userId:req.user._id})
return res.status(201).json({message:'created',category})
}

export const updateCateory=async (req,res,next)=>{
    // const {name}=req.body
    const category = await categoryModel.findById({_id:req.params.categoryId})
    if(!category){
        return next(new Error('category not found',{cause:400}))
    }
    if(req.body.name){
        if(await categoryModel.findOne({name:req.body.name})){
            return next(new Error('category name is exist',{cause:400}))
        }
        category.name=req.body.name
        category.slug=slugify(req.body.name,'-')
    }
    let image;
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
        await cloudinary.uploader.destroy(category.image.public_id)
        image={public_id,secure_url}
    }
    await category.save()
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
    const catigores=await categoryModel.find({isDeleted:false}).select('name slug image').populate([{
        path:"subCategories"
    }])
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