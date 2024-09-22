import userModel from "../../../../DB/model/User.model.js"
import {hash} from './../../../utils/HashAndCompare.js'
import cloudinay from './../../../utils/cloudinary.js'
import {generateToken,verifyToken} from './../../../utils/GenerateAndVerifyToken.js'
import sendEmail from './../../../utils/email.js'

export const signUp=async (req,res,next)=>{
    const {email,userName,password}=req.body
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
    const info =await sendEmail({to:email,subject:"confirm Email",html:html})
    if(!info){
        return next(new Error('email rejected',{cause:400}))
    }
    if(req.file){
        const {public_id,secure_url}=await cloudinay.uploader.upload(req.file,{folder:`user`})
        req.body.image={public_id,secure_url}
    }
    const hashPassword=hash({plaintext:password})
    const {_id}=await userModel.create({email,userName,password:hashPassword,image:req.body.image})
    return res.status(201).json({message:"done",_id})

}