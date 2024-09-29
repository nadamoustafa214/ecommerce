import { Router } from "express";
import {asyncHandler} from './../../utils/errorHandling.js'
import  * as PC from './controller/prouduct.js' 
import  {fileUpload,fileValidation} from './../../utils/multer.js'
import {validation} from './../../middleware/validation.js'
import * as validators from './product.validation.js'
import { endPoint } from "./product.endPoint.js";
import auth from './../../middleware/auth.js'
const router = Router()


router.post('/newProduct',auth(endPoint.create),
fileUpload(fileValidation.image).fields([{
    name:"mainImage",maxCount:1},
    {name:"subImages",maxCount:5}]),
    validation(validators.createProductSchema),PC.createProduct)






export default router