import mongoose, { Schema,Types,model } from "mongoose";

const cartSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true,unique:true},
    items:[{
        productId:{type:Types.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,required:true,default:1}
    }]

},{timestamps:true})

const cartModel=mongoose.model.Cart || model('Cart',cartSchema)
export default cartModel 