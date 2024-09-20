import cloudinary from './../../../utils/cloudinary.js'
import couponModel from '../../../../DB/model/Coupon.model.js'

export const createCoupon=async (req,res,next)=>{
if(await couponModel.findOne({name:req.body.name})){
    return next(new Error('coupon name already exist',{cause:409}))
}
if(req.file){
    const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`coupon`})
    req.body.image={secure_url,public_id}  
}
const coupon = await couponModel.create(req.body)
    return res.status(201).json({message:'created',coupon})
}

export const updateCoupon=async (req,res,next)=>{
    const coupon = await couponModel.findById({_id:req.params.couponId})
    if(!coupon){
        return next(new Error('coupon not found',{cause:400}))
    }
    if(req.body.name){
        if(await couponModel.findOne({name:req.body.name})){
            return next(new Error('coupon name is exist',{cause:409}))
        }if(coupon.name==req.body.name){
            return next(new Error('coupon name duplcated',{cause:409}))
        }
        coupon.name=req.body.name
    }
    
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
        if(coupon.image.secure_url){
            await cloudinary.uploader.destroy(coupon.image.public_id)
        }
       coupon.image={public_id,secure_url}
    }
    if(req.body.amount){
        coupon.amount=req.body.amount
    }
    await coupon.save()
    return res.status(200).json({message:'updated',coupon})
}

export const deleteCoupon=async (req,res,next)=>{
    const coupon=await couponModel.findByIdAndUpdate({_id:req.params.couponId},{isDeleted:true})
    if(!coupon || coupon.isDeleted==true){
        return next(new Error('coupon not found'),{cause:400})
    }
    if(coupon.image.public_id){
        await cloudinary.uploader.destroy(coupon.image.public_id)
    }
    return res.status(200).json({message:"done"})
}

export const getAllCoupons=async (req,res,next)=>{
    const coupons=await couponModel.find({isDeleted:false}).select('name image amount')
    if(!coupons){
        return next(new Error('no coupons found',{cause:400}))
    }
    return res.status(200).json({message:"done",coupons})
}

export const getOneCoupon=async (req,res,next)=>{
        const coupon=await couponModel.findById({_id:req.params.couponId})
        if(!coupon || coupon.isDeleted===true){
            return next(new Error('coupon not found',{cause:400}))
        }
        return res.status(200).json({message:'done',coupon})
}