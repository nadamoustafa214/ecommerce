import mongoose, { Schema,Types,model } from "mongoose";

const reviewSchema=new Schema({
comment:{type:String,min:1,required:true},
rating:{type:Number,min:1,max:5},
productId:{type:Types.ObjectId,ref:'Product',required:true},
userId:{type:Types.ObjectId,ref:'User',required:true},
orderId:{type:Types.ObjectId,ref:'Order',required:true}
}, {
    timestamps:true
})

const reviewModel=mongoose.model.Review || model('Review',reviewSchema)

export default reviewModel