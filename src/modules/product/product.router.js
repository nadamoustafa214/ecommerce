import { Router } from "express";
import {asyncHandler} from './../../utils/errorHandling.js'
import  * as PC from './controller/prouduct.js' 
import  {fileUpload,fileValidation} from './../../utils/multer.js'
import {validation} from './../../middleware/validation.js'
import * as validators from './product.validation.js'
import { endPoint } from "./product.endPoint.js";
import auth from './../../middleware/auth.js'
import review from './../reviews/reviews.router.js'
const router = Router()

router.use('/:productId/review',review)


router.post('/newProduct',auth(endPoint.create),
    fileUpload(fileValidation.image).fields([{
    name:"mainImage",maxCount:1},
    {name:"subImages",maxCount:5}]),
    validation(validators.createProductSchema),asyncHandler(PC.createProduct))
router.put('/updateProduct/:productId',auth(endPoint.update),
    fileUpload(fileValidation.image).fields([{
    name:"mainImage",maxCount:1},
    {name:"subImages",maxCount:5}]),
    validation(validators.updateProductSchema),asyncHandler(PC.updateProduct))
router.patch('/deleteProduct/:productId',auth(endPoint.delete),validation(validators.deleteProductSchema),PC.deleteProduct)
router.patch('/:productId/addWishList',auth(endPoint.addWishList),validation(validators.addToWishListSchema),PC.addToWishList)
router.patch('/:productId/removeWishList',auth(endPoint.addWishList),validation(validators.addToWishListSchema),PC.removeToWishList)

router.get('/',PC.getProducts)






export default router