import { status } from 'init'
import orderModel from '../../../../DB/model/Order.model.js'
import couponModel from './../../../../DB/model/Coupon.model.js'
import productModel from './../../../../DB/model/poduct.model.js'


export const createOrder=async (req,res,next)=>{
    const {items,address,phone,note,couponName,paymentType}=req.body
    if(couponName){
        const coupon=await couponModel.findOne({name:couponName.toLowerCase(),usedBy:{$nin:req.user._id}})
        if(!coupon){
            return next(new Error('invalid or expired coupon',{cause:400}))
        }
        req.body.coupon=coupon
    }
    const productIds=[]
    const finalProuductList=[]
    let subtotal=0
    for(const item of items ){
        const checkProduct=await productModel.findOne({
            _id:item.productId,
            stock:{$gte:item.quantity},
            isDeleted:false
        })

        if(!checkProduct){
            return next(new Error('invalid product ',{cause:400}))
        }
        productIds.push(item.productId)
        item.name=checkProduct.name
        item.unitPrice=checkProduct.finalPrice
        item.finalPrice=item.quantity * checkProduct.finalPrice.toFixed(2)
        subtotal+=item.finalPrice

    }
    const order=await orderModel.create({
        userId:req.user._id,
        address,note,phone,items:finalProuductList,couponId:req.body.coupon?._id,subtotal,
        finalPrice:subtotal-(subtotal*((req.body.coupon?.amount||0)/100)).toFixed(2),
        paymentType,
        status:paymentType =='card' ? 'waitPayment':"placed"
    })

    for (const item of items) {
        await productModel.updateOne({_id:item.productId},{$inc:{stock:- parseInt(item.quantity)}})
    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }

    await cartModel.updateOne({userId:req.user._id},{
        $pull:{items:{
            productId:{$in:productIds}
        }}
    })

    return res.status(201).json({message:"done",order})
}