import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createBrandSchema = joi.object({
    name:joi.string().required(),
    file:generalFields.file.required()
}).required()

export const updateBrandSchema = joi.object({
    brandId:generalFields.id.required(),
    name:joi.string(),
    file:generalFields.file

}).required()

export const deleteBrandSchema = joi.object({
    brandId:generalFields.id.required(),
}).required()

export const getOneBrandSchema = joi.object({
    brandId:generalFields.id.required(),
}).required()