import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createCouponSchema = joi.object({
    name:joi.string().required(),
    amount:joi.number().min(1).max(100).positive(),
    file:generalFields.file,
    expireDate:joi.date().greater(Date.now()).required()

}).required()

export const updateCouponSchema = joi.object({
    couponId:generalFields.id.required(),
    name:joi.string(),
    amount:joi.number().min(1).max(100).positive(),
    file:generalFields.file,
    expireDate:joi.date().greater(Date.now()).required()

}).required()

export const deleteCouponSchema = joi.object({
    couponId:generalFields.id.required(),
}).required()

export const getOneCouponSchema = joi.object({
    couponId:generalFields.id.required(),
}).required()