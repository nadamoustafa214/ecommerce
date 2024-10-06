import userModel from "../../../../DB/model/User.model.js"
import {compare, hash} from '../../../utils/HashAndCompare.js'
import cloudinay from '../../../utils/cloudinary.js'
import {generateToken,verifyToken} from '../../../utils/GenerateAndVerifyToken.js'
import sendEmail from '../../../utils/email.js'
import { nanoid ,customAlphabet } from "nanoid"

export const signUp=async (req,res,next)=>{
    const {email,userName,password,phone}=req.body
    if(await userModel.findOne({email})){
        return next(new Error('user already exist',{cause:409}))
    }
    const token=generateToken({payload:{email},expiresIn:60*5,signature:process.env.EMAIL_SIGNA})
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`

    const refreshToken=generateToken({payload:{email},expiresIn:60*60*24,signature:process.env.EMAIL_SIGNA})
    const refreshLink =`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`

    const html=`<a href="${link}">click here to confirm your email</a>
    <br></br>
    <a href="${refreshLink}">request new email</a>
    `
    // const info =await sendEmail({to:email,subject:"confirm Email",html:html})
    // if(!info){
    //     return next(new Error('email rejected',{cause:400}))
    // }
    if(req.file){
        const {public_id,secure_url}=await cloudinay.uploader.upload(req.file.path,{folder:`user`})
        req.body.image={public_id,secure_url}
    }
    const hashPassword=hash({plaintext:password})
    const {_id}=await userModel.create({email:email.toLowerCase(),userName,password:hashPassword,image:req.body.image,phone})
    return res.status(201).json({message:"done",_id})

}

export const confirmEmail=async (req,res,next)=>{
    const {token}=req.params
    const {email}=verifyToken({token:token})
    if(!email){
        return next(new Error('invalid payload'))
    }
    const user=await userModel.updateOne({email:email.toLowerCase()},{confirmEmail:true})
    return res.status(200).json({message:"confirm email done"})
}

export const newConfirnEmail=async (req,res,next)=>{
    const {token}=req.params
    const {email}=verifyToken({token:token})
    if(!email){
        return next(new Error('invalid payload'))
    }
    const user=await userModel.findOne({email})
    if(!user){
        return next(new Error('not regester account'))
    }
    if(user.confirmEmail){
        return res.status(200).json({message:"confirm email done"})
    }

    const newtoken=generateToken({payload:{email},expiresIn:60*2,signature:process.env.EMAIL_SIGNA})
    const link =`${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`

    // const refreshToken=generateToken({payload:{email},expiresIn:60*60*24,signature:process.env.EMAIL_SIGNA})
    // const refreshLink =`${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`

    const html=`<a href="${link}">click here to confirm your email</a>
    <br></br>
    `
    const info =await sendEmail({to:email,subject:"confirm Email",html:html})
    if(!info){
        return next(new Error('email rejected',{cause:400}))
    }
    return res.status(200).json({message:"requested new email done"})

}

export const login=async (req,res,next)=>{
    const {email,password}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next(new Error('user not found',{cause:404}))
    }
    if(!user.confirmEmail){
        return next(new Error('confim email first ',{cause:404}))
    }
    if(!compare({plaintext:password,hashValue:user.password})){
        return next(new Error('email or password is wrong',{cause:40}))
    }
    const token=generateToken({payload:{id:user._id,role:user.role},expiresIn:60*30})
    const refreshToken=generateToken({payload:{id:user._id,role:user.role},expiresIn:60*60*24*365})
    user.status="online"
    await user.save()

    return res.status(200).json({message:"done",token,refreshToken})

}

export const sendCode=async (req,res,next)=>{
    const {email}=req.body
    const nanoid=customAlphabet('123456789',6)
    const code=nanoid()
    const user=await userModel.findOneAndUpdate({email:email.toLowerCase()},{code:code})
    if(!user){
        return next(new Error('not register account',{cause:404}))
    }
    const html=`<h1>forget password <hr>
    your code id ${code}
    </h1>`
    const info=await sendEmail({to:email,subject:"forget password",html:html})
    
    if(!info){
        return next(new Error('email rejected',{cause:404}))
    }
    return res.status(200).json({message:"done"})

}

export const resetPassword=async (req,res,next)=>{
    const {email,password,code}=req.body
    const user=await userModel.findOne({email})
    if(!user){
        return next(new Error('email not found',{cause:404}))
    }
    if(code!=user.code){
        return next(new Error('invalid code',{cause:400}))
    }
    const hashPassword=hash({plaintext:password})
    user.password=hashPassword
    user.code=null
    user.changePassTime=Date.now()
    await user.save()
    return res.status(200).json({message:"done"})

}