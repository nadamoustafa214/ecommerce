import * as CC from './controller/cart.js'
import { validation } from '../../middleware/validation.js';
import * as validators from './cart.validation.js'
import {endPoint} from './cart.endPoint.js'
import { asyncHandler } from '../../utils/errorHandling.js';
import { Router } from "express";
import auth from '../../middleware/auth.js';
const router = Router()




router.post('/',auth(endPoint.create),CC.createCart)




export default router