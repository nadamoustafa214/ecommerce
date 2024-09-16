import { Router } from "express";
import * as CC from './controller/category.js'
// import asyncHandler from './../../utils/errorHandling.js'
import {fileValidation,fileUpload} from './../../utils/multer.js'
const router = Router()


router.post('/newCategory',fileUpload(fileValidation.image).single('image'),CC.createCategory)
router.put('/updateCategory/:categoryId',fileUpload(fileValidation.image).single('image'),CC.updateCateory)
router.patch('/deleteCategory/:categoryId',CC.deleteCategory)
router.get('/allCategories',CC.getAllCatigories)
router.post('/:categoryId',CC.getOneCategory)





export default router