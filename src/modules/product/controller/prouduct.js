import userModel from "../../../../DB/model/User.model.js";
import subCategoryModel from './../../../../DB/model/subCategory.model.js'
import prouductModel from "../../../../DB/model/poduct.model.js";
import brandModel from './../../../../DB/model/Brand.model.js'
import cloudinary from './../../../utils/cloudinary.js'
import { nanoid } from "nanoid";
import slugify from "slugify";


export const createProduct=async (req,res,next)=>{
    const {name,price,categoryId,subCategoryId,brandId,discount}=req.body
    const customId=nanoid()
    const user=await userModel.findById(req.user._id)
    if(!user || user.role=='user'){
        return next(new Error('invalid user',{cause:404}))
    }
    if(!await subCategoryModel.findById({_id:subCategoryId,categoryId})){
        return next(new Error('category or sub category not found',{cause:404}))
    }
    if(!await brandModel.findById({_id:brandId})){
        return next(new Error('brand not found',{cause:404}))
    }
    req.body.customId=customId
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`category/subCategory/product/${customId}`})
    req.body.mainImage={secure_url,public_id}

            if(req.files.subImages){
                req.body.subImages=[]
                for(const file of req.files.subImages){
                    const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`category/subCategory/product/${customId}`})
                    req.body.subImages.push({secure_url,public_id})
                }
            }
        req.body.finalPrice=price -(price*((discount||0)/100))
        req.body.createdBy=req.user._id
        req.body.slug=slugify(name,{replacement:"-",trim:true,lower:true})
    const product=await prouductModel.create(req.body)
    return res.status(201).json({message:"product created",product})
}