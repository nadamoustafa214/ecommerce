import cloudinary from './../../../utils/cloudinary.js'
import brandModel from '../../../../DB/model/Brand.model.js'

export const createBrand=async (req,res,next)=>{
if(await brandModel.findOne({name:req.body.name})){
    return next(new Error('brand name already exist',{cause:409}))
}
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`Brand`})
req.body.image={secure_url,public_id}  

const brand = await brandModel.create(req.body)
    return res.status(201).json({message:'created',brand})
}

export const updateBrand=async (req,res,next)=>{
    const brand = await brandModel.findById({_id:req.params.brandId})
    if(!brand){
        return next(new Error('brand not found',{cause:400}))
    }
    if(req.body.name){
        if(await brandModel.findOne({name:req.body.name})){
            return next(new Error('brand name is exist',{cause:409}))
        }if(brand.name==req.body.name){
            return next(new Error('brand name duplcated',{cause:409}))
        }
        brand.name=req.body.name
    }
    
    if(req.file){
        const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`brand`})
            await cloudinary.uploader.destroy(brand.image.public_id)
       brand.image={public_id,secure_url}
    }
   
    await brand.save()
    return res.status(200).json({message:'updated',brand})
}

export const deleteBrand=async (req,res,next)=>{
    const brand=await brandModel.findByIdAndUpdate({_id:req.params.brandId},{isDeleted:true})
    if(!brand || brand.isDeleted==true){
        return next(new Error('brand not found'),{cause:400})
    }
    await cloudinary.uploader.destroy(brand.image.public_id)
    return res.status(200).json({message:"done"})
}

export const getAllBrands=async (req,res,next)=>{
    const brands=await brandModel.find({isDeleted:false}).select('name image')
    if(!brands){
        return next(new Error('no brands found',{cause:400}))
    }
    return res.status(200).json({message:"done",brands})
}

export const getOneBrand=async (req,res,next)=>{
        const brand=await brandModel.findById({_id:req.params.brandId})
        if(!brand || brand.isDeleted===true){
            return next(new Error('brand not found',{cause:400}))
        }
        return res.status(200).json({message:'done',brand})
}