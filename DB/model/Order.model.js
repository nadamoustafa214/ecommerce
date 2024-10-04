import mongoose, { Schema,Types,model } from "mongoose";

const orderSchema=new Schema({
    userId:{type:Types.ObjectId,ref:'User',required:true},
    items:[{
        name:{type:String,required:true},
        productId:{type:Types.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,required:true,default:1},
        unitPrice:{type:Number,default:1,required:true},
        finalPrice:{type:Number,default:1,required:true}
    }],
    couponId:{type:Types.ObjectId,ref:'Coupon'},
    subtotal:{type:Number,default:1,required:true},
    finalPrice:{type:Number,default:1,required:true},
    paymentType:{type:String,default:"cash",enum:['cash','card']},
    status:{type:String,default:'placed',enum:['waitPayment','placed','canceled','rejected','onWay','deliverd']},
    reason:String,
    updatedBy:{type:Types.ObjectId,ref:'User'}

},{timestamps:true})

const orderModel=mongoose.model.Order || model('Order',orderSchema)
export default orderModel 