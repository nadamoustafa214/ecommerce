import mongoose, { Schema,model,Types } from "mongoose";

const categorySchema=new Schema({
    name:{type:String,required:true},
    image:{type:Object,required:true},
    slug:{type:String,required:true},
    userId:{type:Types.ObjectId,ref:'User',required:false},
    isDeleted:{type:Boolean,default:false}
},
{timestamps:true})

const categoryModel= mongoose.model.Category || model('Category',categorySchema)
export default categoryModel