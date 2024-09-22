import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signUpSchema=joi.object({
    userName:joi.string().min(2).max(20).alphanum().required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cpassword:generalFields.cPassword.valid(joi.ref('password'))
}).required()