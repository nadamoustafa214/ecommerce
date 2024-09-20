import { Router } from "express";
import * as CC from './controller/coupon.js'
import { validation } from "../../middleware/validation.js";
import {fileValidation,fileUpload} from './../../utils/multer.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from '../coupon/coupon.validation.js' 
const router = Router()



router.post('/newCoupon',fileUpload(fileValidation.image).single('image'),validation(validators.createCouponSchema),asyncHandler(CC.createCoupon))
router.put('/updateCoupon/:couponId',fileUpload(fileValidation.image).single('image'),validation(validators.updateCouponSchema),asyncHandler(CC.updateCoupon))
router.patch('/deleteCoupon/:couponId',validation(validators.deleteCouponSchema),asyncHandler(CC.deleteCoupon))
router.get('/',asyncHandler(CC.getAllCoupons))
router.post('/:couponId',validation(validators.getOneCouponSchema),asyncHandler(CC.getOneCoupon))



export default router