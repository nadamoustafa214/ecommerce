import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const newCategorySchema=joi.object({
name:joi.string().min(2).max(50).required(),
file:generalFields.file,
// userId:generalFields.id

}).required()

export const updateCategorySchema=joi.object({
name:joi.string().min(2).max(50),
file:generalFields.file,
categoryId:generalFields.id.required(),

}).required()

export const deleteCategorySchema=joi.object({
    // name:joi.string().min(2).max(50).required(),
    // file:generalFields.file,
    categoryId:generalFields.id.required(),
    
}).required()

export const getOneCategorySchema=joi.object({
    categoryId:generalFields.id.required(),
}).required()

