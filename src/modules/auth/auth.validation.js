import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
import { token } from 'morgan'

export const signUpSchema=joi.object({
    userName:joi.string().min(2).max(20).alphanum().required(),
    email:generalFields.email.required(),
    password:generalFields.password.required(),
    cpassword:generalFields.cPassword.valid(joi.ref('password')),
    phone:joi.string().required(),
    file:generalFields.file
}).required()

export const confirmEmailSchema=joi.object({token:joi.string().required()}).required()

export const loginSchema=joi.object({
    email:generalFields.email,
    password:generalFields.password
}).required()

export const restPasswordSchema=joi.object({
    password:generalFields.password.required(),
    cpassword:generalFields.cPassword.valid(joi.ref('password')).required(),
    email:generalFields.email.required(),
    code:joi.string().pattern(new RegExp(/^[0-9]{6}$/)).required()
}).required()