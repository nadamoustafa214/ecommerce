import { Router } from "express";
import * as CC from './controller/category.js'
// import asyncHandler from './../../utils/errorHandling.js'
import {fileValidation,fileUpload} from './../../utils/multer.js'
const router = Router()


router.post('/newCategory',fileUpload(fileValidation.image).single('image'),CC.createCategory)






export default router