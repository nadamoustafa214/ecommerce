import cartModel from "../../../../DB/model/Cart.model.js"
import prouductModel from "../../../../DB/model/poduct.model.js"

export const createCart=async (req,res,next)=>{
    const {productId,quantity}=req.body
    const product=await prouductModel.findById(productId)
    if(!product){
        return next(new Error('product not found',{cause:404}) )
    }
     if(product.stock<quantity || product.isDeleted==true){
        await prouductModel.updateOne({productId},{$addToSet:{wishUserList:req.user._id}})
        return next(new Error('out of stock',{cause:400}))
    }
    const cart=await cartModel.findOne({userId:req.user._id})
    if(!cart){
      const  newCart=await cartModel.create({userId:req.user._id,items:[{productId,quantity}]})
        return res.status(201).json(newCart)
    }

    // if cart exist Option 1
    let matchProduct=false
    for (let i = 0; i< cart.items.length; i++) {
        if(cart.items[i].productId.toString()==productId){
            cart.items[i].quantity=quantity
            matchProduct=true
            break;
        }
       
    }
// push new item
    if(!matchProduct){
        cart.items.push({productId,quantity})
    }
    await cart.save()
    return res.status(200).json({message:"done",cart})

}

export async function deleteItemsFromCart(userId,productIds){
   const cart= await cartModel.updateOne({userId},{
        $pull:{items:{
            productId:{$in:productIds}
        }}
    })
    return cart
}

export const deleteItems=async (req,res,next)=>{
const {productIds}=req.body
  const cart=  await deleteItemsFromCart(productIds,req.user._id)
    return res.status(200).json({message:"done",cart})
      
}

export async function clearItem(userId){
    const cart= await cartModel.updateOne({userId},{ items:[]})
     return cart
}

export const  emptyCart=async (req,res,next)=>{
      const cart=  await clearItem(req.user._id)
        return res.status(200).json({message:"done",cart})   
}
