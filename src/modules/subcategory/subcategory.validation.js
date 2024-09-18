import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'


export const newSubCategorySchema=joi.object({
name:joi.string().min(2).max(50).required(),
file:generalFields.file.required(),
categoryId:generalFields.id.required()
// userId:generalFields.id

}).required()

export const updateSubCategorySchema=joi.object({
name:joi.string().min(2).max(50),
file:generalFields.file,
categoryId:generalFields.id.required(),
subCategoryId:generalFields.id.required(),
}).required()

export const deleteSubCategorySchema=joi.object({
    categoryId:generalFields.id.required(),
    subCategoryId:generalFields.id.required(),
}).required()

export const getOneCategorySchema=joi.object({
    categoryId:generalFields.id.required(),
    subCategoryId:generalFields.id.required(),

}).required()

