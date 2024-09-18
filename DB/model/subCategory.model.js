import mongoose, { Schema,model,Types } from "mongoose";

const subCategorySchema=new Schema({
    name:{type:String,required:true,unique:true},
    customId:{type:String},
    image:{type:Object,required:true},
    slug:{type:String,required:true},
    userId:{type:Types.ObjectId,ref:'User',required:false},
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    isDeleted:{type:Boolean,default:false}
},
{timestamps:true})

const subCategoryModel= mongoose.model.subCategory || model('SubCategory',subCategorySchema)
export default subCategoryModel