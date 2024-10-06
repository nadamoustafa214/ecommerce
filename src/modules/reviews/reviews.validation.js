import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createReviewSchema=joi.object({
    comment:joi.string().min(1).max(1500).required(),
    rating:joi.number().min(1).max(5).required(),
    productId:generalFields.id,
    // userId:generalFields.id,
    orderId:generalFields.id
}).required()

export const updateReviewSchema=joi.object({
    comment:joi.string().min(1).max(1500),
    rating:joi.number().min(1).max(5),
    productId:generalFields.id,
    // userId:generalFields.id,
    reviewId:generalFields.id
}).required()

export const deleteReviewSchema=joi.object({
    productId:generalFields.id,
    // userId:generalFields.id,
    // orderId:generalFields.id,
    reviewId:generalFields.id
}).required()