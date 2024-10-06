import mongoose, { Schema,model,Types } from "mongoose";

const proudctSchema=new Schema({
    name:{type:String,required:true,trim:true,lowerCase:true},
    sulg:{type:String,trim:true,lowerCase:true},
    description:String,
    stock:{type:Number,default:1},
    price:{type:Number,default:1,required:true},
    discount:{type:Number,default:0},
    finalPrice:{type:Number,default:1},
    colors:[String],
    size:{
        type:[String],
        enum:['s','m','lg','xl']
    },
    mainImage:{type:Object,required:true},
    subImages:{type:[Object]},
    categoryId:{type:Types.ObjectId,ref:'Category',required:true},
    subCategoryId:{type:Types.ObjectId,ref:'SubCategory',required:true},
    brandId:{type:Types.ObjectId,ref:'Brand',required:true},
    createdBy:{type:Types.ObjectId,ref:'User',required:true},
    updatedBy:{type:Types.ObjectId,ref:'User',required:false},
    wishUserList:[{type:Types.ObjectId,ref:'User'}],
    isDeleted:{type:Boolean,required:false},
    customId:String

},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps:true
})
proudctSchema.virtual('review',{
    localField:'_id',
    foreignField:'productId',
    ref:'Review'
})


const prouductModel= mongoose.model.Prouduct ||model('Prouduct',proudctSchema)

export default prouductModel