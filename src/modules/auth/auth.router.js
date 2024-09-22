import { Router } from "express";
import * as UC from './controller/registration.js'
import {asyncHandler} from './../../utils/errorHandling.js'
import {validation} from './../../middleware/validation.js'
import * as validator from './auth.validation.js'
import {fileValidation,fileUpload} from './../../utils/multer.js'


const router = Router()

router.post('/signUp',fileUpload(fileValidation.image).single('profilePic'),validation(validator.signUpSchema),UC.signUp)


export default router