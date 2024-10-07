import cloudinary from './../../../utils/cloudinary.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import subCategoryModel from './../../../../DB/model/subCategory.model.js'
import slugify from 'slugify'
import { nanoid } from 'nanoid'

export const createSubCategory=async (req,res,next)=>{
const issubCategory=await subCategoryModel.findOne({name:req.body.name})
if(issubCategory){
    return next(new Error("subCategory name is exist",{cause:400}))
}
if(!await categoryModel.findById(req.params.categoryId)){
return next(new Error('category not found',{cause:400}))
}
// console.log(req.params.categoryId);

let customId=nanoid()
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`category/subCategory/${customId}`})
const subCategory=await subCategoryModel.create({name:req.body.name,image:{secure_url,public_id},slug:slugify(req.body.name,'-'),customId,categoryId:req.params.categoryId})
return res.status(201).json({message:'created',subCategory})
}

export const updateSubCateory=async (req,res,next)=>{
    // const {name}=req.body
    const subCategory=await subCategoryModel.findById(req.params.subCategoryId)
    if(!subCategory){
        return next(new Error('Subcategory not found',{cause:400}))
    }
    const category = await categoryModel.findById({_id:req.params.categoryId})
    // console.log(subCategory.categoryId.toString()!=req.params.categoryId);
    
    if(!category){
        if(subCategory.categoryId.toString()!=req.params.categoryId){
            return next(new Error('category not same ',{cause:400}))
        }
        return next(new Error('category not found',{cause:400}))
    }
    if(req.body.name){
        if(subCategory.name==req.body.name){
            return next(new Error('subcategory name is exist',{cause:400}))
        }
        if(await subCategoryModel.findOne({name:req.body.name})){
            return next(new Error(' duplicate subcategory',{cause:400}))
        }
        subCategory.name=req.body.name
        subCategory.slug=slugify(req.body.name,'-')
    }
    let image;
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`category/subCategory/${subCategory.customId}`})
        await cloudinary.uploader.destroy(category.image.public_id)
        image={public_id,secure_url}
    }
    await subCategory.save()
    return res.status(200).json({message:'updated',subCategory})
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