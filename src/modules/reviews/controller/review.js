import orderModel from "../../../../DB/model/Order.model.js"
import prouductModel from "../../../../DB/model/poduct.model.js"
import reviewModel from "../../../../DB/model/reviews.model.js"


export const createReview=async (req,res,next)=>{
    const {comment,rating}=req.body
    const order=await orderModel.findOne({
        _id:req.params.orderId,
        userId:req.user._id,
        status:"delivered",
        // "items.productId":req.params.productId
    })
    // console.log(req.params.productId);
    
    if(!order){
        return next(new Error('cant review product before recive it ',{cause:404}))
    }
    const review=await reviewModel.create({comment,rating,userId:req.user._id,orderId:req.params.orderId,productId:req.params.productId})
    return res.status(201).json({message:"done",review})

}

export const updateReview=async (req,res,next)=>{
    const {productId,reviewId}=req.params
    const review=await  reviewModel.findOneAndUpdate({_id:reviewId,productId},req.body)
    if(!review){
        return next(new Error('review not found',{cause:404}))
    }
    return res.status(201).json({message:"done",review})
}

export const deleteReview=async (req,res,next)=>{
    const {productId,reviewId}=req.params
    const review=await  reviewModel.findOneAndDelete({_id:reviewId,productId})
    if(!review){
        return next(new Error('review not found',{cause:404}))
    }
    return res.status(201).json({message:"done"})

}