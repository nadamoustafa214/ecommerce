import cloudinary from './../../../utils/cloudinary.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import slugify from 'slugify'

export const createCategory=async (req,res,next)=>{
try {
    const {name}=req.body
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`category`})
const category=await categoryModel.create({name,image:{secure_url,public_id},slug:slugify(name,'-')})
return res.status(201).json({message:'created',category})

}catch(err){
    return res.status(400).json({message:'error',err})

}
}