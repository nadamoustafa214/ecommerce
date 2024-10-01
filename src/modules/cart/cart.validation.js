 import joi from 'joi'
 import {generalFields} from './../../middleware/validation.js'

 export const createCartSchema=joi.object({
    userId:generalFields.optionId,
    items:joi.array().items(joi.object({
        productId:generalFields.optionId,
        quantity:joi.number().positive().min(1)
    }).required())
 }).required()