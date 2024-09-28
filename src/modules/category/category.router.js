import { Router } from "express";
import * as CC from './controller/category.js'
import { validation } from "../../middleware/validation.js";
import {fileValidation,fileUpload} from './../../utils/multer.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from '../category/category.validation.js' 
import subCategory from "./../subcategory/subcategory.router.js"
import auth, { roles } from "../../middleware/auth.js";
import { endPoint } from "./category.endPoint.js";

const router = Router()

router.use('/:categoryId/subCategory',subCategory)

router.post('/newCategory',auth(endPoint.create),fileUpload(fileValidation.image).single('image'),validation(validators.newCategorySchema),CC.createCategory)
router.put('/updateCategory/:categoryId',fileUpload(fileValidation.image).single('image'),validation(validators.updateCategorySchema),asyncHandler(CC.updateCateory))
router.patch('/deleteCategory/:categoryId',validation(validators.deleteCategorySchema),asyncHandler(CC.deleteCategory))
router.get('/allCategories',auth(Object.values(roles)),asyncHandler(CC.getAllCatigories))
router.post('/:categoryId',validation(validators.getOneCategorySchema),asyncHandler(CC.getOneCategory))





export default router