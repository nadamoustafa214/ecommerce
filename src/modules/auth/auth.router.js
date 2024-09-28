import { Router } from "express";
import * as UC from './controller/auth.js'
import {asyncHandler} from './../../utils/errorHandling.js'
import {validation} from './../../middleware/validation.js'
import * as validator from './auth.validation.js'
import {fileValidation,fileUpload} from './../../utils/multer.js'


const router = Router()

router.post('/signUp',fileUpload(fileValidation.image).single('profilePic'),validation(validator.signUpSchema),asyncHandler(UC.signUp))
router.get('/confirmEmail/:token',validation(validator.confirmEmailSchema),UC.confirmEmail)
router.get('/newConfirmEmail/:token',validation(validator.confirmEmailSchema),UC.newConfirnEmail)
router.post('/login',validation(validator.loginSchema),UC.login)
router.post('/sendCode',asyncHandler(UC.sendCode))
router.post('/forgetPassword',validation(validator.restPasswordSchema),UC.resetPassword)


export default router