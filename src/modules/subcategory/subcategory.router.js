import { Router } from "express";
import * as SC from './controller/subCategory.js'
import { validation } from "../../middleware/validation.js";
import {fileValidation,fileUpload} from './../../utils/multer.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from '../subcategory/subcategory.validation.js' 
const router = Router({mergeParams:true})

router.post('/',fileUpload(fileValidation.image).single('image'),validation(validators.newSubCategorySchema),asyncHandler(SC.createSubCategory))
router.put('/:subCategoryId',fileUpload(fileValidation.image).single('image'),validation(validators.updateSubCategorySchema),asyncHandler(SC.updateSubCateory))
// router.patch('/deleteCategory/:categoryId',validation(validators.deleteCategorySchema),asyncHandler(CC.deleteCategory))
// router.get('/allCategories',asyncHandler(CC.getAllCatigories))
// router.post('/:categoryId',validation(validators.getOneCategorySchema),asyncHandler(CC.getOneCategory))



export default router