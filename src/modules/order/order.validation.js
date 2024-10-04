import joi from "joi";
import {generalFields} from './../../middleware/validation.js'

export const createOrderSchema=joi.object({
    note:joi.string().min(1),
    address:joi.string().min(1).required(),
    phone:joi.array().items(
        joi.string().min(11).max(11).required()
    ).min(1).max(2).required(),
    couponName:joi.string(),
    paymentType:joi.string().valid("cash",'card'),
    items:joi.array().items(
        joi.object({
            productId:generalFields.id,
            quantity:joi.number().positive().integer().min(1).required()
        }).required()
    ).min(1)

}).required()

export const cancelOrderSchema=joi.object({
    reason:joi.string().min(1).required(),
    orderId:generalFields.id
}).required()

export const updateStatusSchema=joi.object({
    status:joi.string().valid('onWay','deliverd').required(),
    orderId:generalFields.id
}).required()