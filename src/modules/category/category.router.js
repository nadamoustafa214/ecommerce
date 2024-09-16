import { Router } from "express";
import * as CC from './controller/category.js'
// import asyncHandler from './../../utils/errorHandling.js'
import {fileValidation,fileUpload} from './../../utils/multer.js'
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()


router.post('/newCategory',fileUpload(fileValidation.image).single('image'),asyncHandler(CC.createCategory))
router.put('/updateCategory/:categoryId',fileUpload(fileValidation.image).single('image'),asyncHandler(CC.updateCateory))
router.patch('/deleteCategory/:categoryId',asyncHandler(CC.deleteCategory))
router.get('/allCategories',asyncHandler(CC.getAllCatigories))
router.post('/:categoryId',asyncHandler(CC.getOneCategory))





export default router