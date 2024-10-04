import auth from '../../middleware/auth.js';
import * as OC from './controller/order.js'
import { endPoint } from './order.endPoint.js';
import { validation } from '../../middleware/validation.js';
import * as validator from './order.validation.js'
import { Router } from "express";
const router = Router()




router.post('/newOrder',auth(endPoint.create),validation(validator.createOrderSchema),OC.createOrder)
router.patch('/:orderId/cancel',auth(endPoint.cancelOrder),validation(validator.cancelOrderSchema),OC.cancelOrder)
router.patch('/:orderId/updateStauts',auth(endPoint.changeStatus),validation(validator.updateStatusSchema),OC.updateOrderStatus)






export default router