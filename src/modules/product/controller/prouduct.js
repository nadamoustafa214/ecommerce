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

export const updateProduct=async (req,res,next)=>{
    const product=await prouductModel.findById({_id:req.params.productId})
    if(!product){
        return next(new Error('product not found',{cause:404}))
    }
    const {name,price,categoryId,subCategoryId,brandId,discount}=req.body
    
    const user=await userModel.findById(req.user._id)
    if(!user || user.role=='user'){
        return next(new Error('invalid user',{cause:404}))
    }
    if(categoryId||subCategoryId){
        if(!await subCategoryModel.findById({_id:subCategoryId,categoryId})){
            return next(new Error('category or sub category not found',{cause:404}))
        }
    }
   if(brandId){
       if(!await brandModel.findById({_id:brandId})){
           return next(new Error('brand not found',{cause:404}))
       }
   }
   if(req.files?.mainImage?.length){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`category/subCategory/product/${product.customId}`})
       await cloudinary.uploader.destroy({secure_url,public_id})
        req.body.mainImage={secure_url,public_id}
   }

    if(req.files?.subImages?.length){
        req.body.subImages=[]
        for(const file of req.files.subImages){
            const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`category/subCategory/product/${product.customId}`})
            req.body.subImages.push({secure_url,public_id})
        }
    }

    if(price && discount){
        req.body.finalPrice=price -(price*((discount||0)/100))
    }else if(price){
        req.body.finalPrice=price -(price*((product.discount)/100))
    }else if(discount){
        req.body.finalPrice=product.price -(product.price*((discount)/100))
    }

    if(name){
        req.body.slug=slugify(name,{replacement:"-",trim:true,lower:true})
    }
        req.body.updatedBy=req.user._id

    await prouductModel.updateOne(req.body)
    return res.status(201).json({message:"product updated",product})
}

export const deleteProduct=async (req,res,next)=>{
    const product=await prouductModel.findByIdAndUpdate({_id:req.params.productId},{isDeleted:true})
    if(!product){
        return next(new Error('product not found',{cause:404}))
    }else if(product.isDeleted==true){
        return next(new Error('product was deleted berfore',{cause:404}))

    }
    return res.status(200).json({message:"deleted" })
}

export const addToWishList=async (req,res,next)=>{
    const product=await prouductModel.findById({_id:req.params.productId})
    if(!product){
        return next(new Error('product not found',{cause:404}))
    }
    await userModel.updateOne({ _id:req.user._id},{$addToSet:{wishList:req.params.productId}})
    return res.status(200).json({message:"done"})
}

export const removeToWishList=async (req,res,next)=>{
    const product = await prouductModel.findById(req.params.productId);
    if (!product) {
      return next(new Error('Product not found', { cause: 404 }));
    }

    // Check if the product is in the user's wishlist
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return next(new Error('User not found', { cause: 404 }));
    }

    if (!user.wishList.includes(req.params.productId)) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    // Remove the product from the user's wishlist
    await userModel.updateOne(
      { _id: req.user._id },
      { $pull: { wishList: req.params.productId } }
    );

    return res.status(200).json({ message: "Product removed from wishlist" });
}