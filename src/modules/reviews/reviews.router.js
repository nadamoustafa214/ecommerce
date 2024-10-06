import { Router } from "express";
import * as RC from './controller/review.js'
import {endPoint} from './reviews.endPoint.js'
import { validation } from "../../middleware/validation.js";
import * as validators from './reviews.validation.js'
import auth from "../../middleware/auth.js";
import {asyncHandler} from './../../utils/errorHandling.js'
const router = Router({mergeParams:true})




router.post('/:orderId',auth(endPoint.create),validation(validators.createReviewSchema),asyncHandler(RC.createReview))
router.put('/:reviewId',auth(endPoint.update),validation(validators.updateReviewSchema),asyncHandler(RC.updateReview))
router.delete('/deleteReview/:reviewId',auth(endPoint.delete),validation(validators.deleteReviewSchema),asyncHandler(RC.deleteReview))






export default router