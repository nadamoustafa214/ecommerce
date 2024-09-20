import mongoose, { Schema,model,Types } from "mongoose";

const categorySchema=new Schema({
    name:{type:String,required:true,unique:true},
    image:{type:Object,required:true},
    slug:{type:String,required:true},
    userId:{type:Types.ObjectId,ref:'User',required:false},
    isDeleted:{type:Boolean,default:false}
},
{
    //to show the new feiles
    toJSON:{virtuals:true},
    toObject:{virtuals:true}, //to show if i log in code 
    timestamps:true
})

categorySchema.virtual('subCategories',{
    localField:'_id',
    foreignField:"categoryId",
    ref:"SubCategory"
})


const categoryModel= mongoose.model.Category || model('Category',categorySchema)
export default categoryModel