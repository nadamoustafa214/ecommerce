import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createProductSchema=joi.object({
    name:joi.string().min(2).max(150).required(),
    description:joi.string().min(2).max(150000),
    size:joi.array(),
    colors:joi.array(),
    stock:joi.number().positive().integer().required(),
    price:joi.number().positive().required(),
    discount:joi.number().positive().min(1),
    categoryId:generalFields.id,
    subCategoryId:generalFields.id,
    brandId:generalFields.id,

    file:joi.object({
        mainImage:joi.array().items(generalFields.file.required()).length(1).required(),
        subImages:joi.array().items(generalFields.file).min(1).max(5)
    }).required()
    
}).required()