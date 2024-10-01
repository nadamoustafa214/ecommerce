import { required } from "joi";
import mongoose, { Schema,model,Types } from "mongoose";

const couponSchema=new Schema({
    name:{type:String,required:true,unique:true,toLowerCase:true},
    image:{type:Object},
    amount:{type:Number,default:1},
    expireDate:{ type:Date,required:true},
    usedBy:[{type:Types.ObjectId,ref:'User'}],
    userId:{type:Types.ObjectId,ref:'User',required:true},
    isDeleted:{type:Boolean,default:false}
},
{
    timestamps:true
})


const couponModel= mongoose.model.Coupon || model('Coupon',couponSchema)
export default couponModel