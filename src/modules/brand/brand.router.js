import { Router } from "express";
import * as BC from './controller/brand.js'
import { validation } from "../../middleware/validation.js";
import {fileValidation,fileUpload} from './../../utils/multer.js'
import { asyncHandler } from "../../utils/errorHandling.js";
import * as validators from '../brand/brand.validation.js' 
const router = Router()



router.post('/newBrand',fileUpload(fileValidation.image).single('image'),validation(validators.createBrandSchema),asyncHandler(BC.createBrand))
router.put('/updateBrand/:brandId',fileUpload(fileValidation.image).single('image'),validation(validators.updateBrandSchema),asyncHandler(BC.updateBrand))
router.patch('/deleteBrand/:brandId',validation(validators.deleteBrandSchema),asyncHandler(BC.deleteBrand))
router.get('/',asyncHandler(BC.getAllBrands))
router.post('/:brandId',validation(validators.getOneBrandSchema),asyncHandler(BC.getOneBrand))



export default router