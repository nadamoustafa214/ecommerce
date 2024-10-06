import orderModel from '../../../../DB/model/Order.model.js'
import couponModel from './../../../../DB/model/Coupon.model.js'
import productModel from './../../../../DB/model/poduct.model.js'
import cartModel from './../../../../DB/model/Cart.model.js'
import {deleteItemsFromCart} from './../../cart/controller/cart.js'



export const createOrder=async (req,res,next)=>{
    const {address,phone,note,couponName,paymentType}=req.body
    if(!req.body.items){
        const cart = await cartModel.findOne({userId:req.user._id})
        if(!cart?.items?.length){
            return next(new Error('empty cart'))
        }
        req.body.isCart=true
        req.body.items=cart.items
    }
  
    if(couponName){
        const coupon=await couponModel.findOne({name:couponName.toLowerCase(),usedBy:{$nin:req.user._id}})
        // console.log("cc",coupon.expireDate);
        
        if(!coupon || coupon.expireDate < Date.now()){
            return next(new Error('invalid or expired coupon',{cause:400}))
        }
        req.body.coupon=coupon
    }
    const productIds=[]
    const finalProuductList=[]
    let subtotal=0

    for(let item of req.body.items ){
        const checkProduct=await productModel.findOne({
            _id:item.productId,
            stock:{$gte:item.quantity},
            isDeleted:false
        })

        if(!checkProduct){
            return next(new Error('invalid product ',{cause:400}))
        }
        if(req.body.isCart){
            //to change from BSON 
            item=item.toObject()
        }
        productIds.push(item.productId)
        item.name=checkProduct.name
        item.unitPrice=checkProduct.finalPrice
        item.finalPrice=item.quantity * checkProduct.finalPrice.toFixed(2)
        subtotal+=item.finalPrice

    }
    console.log(finalProuductList);
    
    const order=await orderModel.create({
        userId:req.user._id,
        address,
        note,
        phone,
        items:finalProuductList,
        couponId:req.body.coupon?._id,subtotal,
        finalPrice:subtotal-(subtotal*((req.body.coupon?.amount||0)/100)).toFixed(2),
        paymentType,
        status:paymentType =='card' ? 'waitPayment':"placed"
    })

    for (const item of req.body.items) {
        await productModel.updateOne({_id:item.productId},{$inc:{stock:- parseInt(item.quantity)}})
    }
    if(req.body.coupon){
        await couponModel.updateOne({_id:req.body.coupon._id},{$addToSet:{usedBy:req.user._id}})
    }
    if(req.body.isCart){
        // await cartModel.updateOne({userId:req.user._id},{items:[]})
        await clearItem(req.user._id)
    }else{
       await deleteItemsFromCart(productIds,req.user._id)
    }

    return res.status(201).json({message:"done",order})
}

export const cancelOrder=async(req,res,next)=>{
    const {orderId}=req.params
    const {reason}=req.body
    const order=await orderModel.findOne({_id:orderId,userId:req.user._id})

    if(!order){
        return next(new Error('invalid order id',{cause:404}))
    }
    if((order?.status!='placed' && order.paymentType=='cash') ||(order?.status!='waitPayment' && order.paymentType=='card')){

        return next(new Error('can not cancel your order ',{cause:404}))
    }
    const orderCanceled= await orderModel.updateOne({_id:order._id},{status:'canceled',reason,updatedBy:req.user._id})
    if(!orderCanceled.matchedCount){
        return next(new Error('fail to cancel your order',{cause:400}))
    }

    for(const item of order.items){
        await productModel.updateOne({_id:item.productId},{$inc:{stock:parseInt(item.quantity)}})
    }

    if(order.couponId){
        await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user._id}})
    }
    return res.status(200).json({message:"done"})
}

export const updateOrderStatus=async(req,res,next)=>{
    const {orderId}=req.params
    const {status}=req.body
    const order=await orderModel.findOne({_id:orderId})
    if(!order){
        return next(new Error('invalid order id',{cause:404}))
    }else if(order.status=='canceled'){
        return next(new Error('cannot change order',{cause:404}))
    }
    // console.log(order.status=='canceled');
    const orderCanceled= await orderModel.updateOne({_id:order._id},{status,updatedBy:req.user._id})
    if(!orderCanceled.matchedCount){
        return next(new Error('fail to cancel your order',{cause:400}))
    }

    return res.status(200).json({message:"done"})
}