import mongoose, { Schema,model,Types } from "mongoose";

const brandSchema=new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:Object,required:true},
    userId:{type:Types.ObjectId,ref:'User',required:false},
    isDeleted:{type:Boolean,default:false}
},
{
    timestamps:true
})


const brandModel= mongoose.model.Brand || model('Brand',brandSchema)
export default brandModel