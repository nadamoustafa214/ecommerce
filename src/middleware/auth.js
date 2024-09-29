import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import {asyncHandler} from './../utils/errorHandling.js'

export const roles={
    admin:"admin",
    user:"user"
}

const auth = (roles=[])=>{
    return async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return res.json({ message: "In-valid bearer key" })
        }
        const token = authorization.split(process.env.BEARER_KEY)[1]
        if (!token) {
            return res.json({ message: "In-valid token" })
        }
        const decoded = verifyToken({token})
        if (!decoded?.id) {
            return res.json({ message: "In-valid token payload" })
        }
        const authUser = await userModel.findById(decoded.id).select('userName email role changePassTime')
        if (!authUser) {
            return res.json({ message: "Not register account" })
        }
    
        // console.log(parseInt(authUser.changePassTime?.getTime()/1000 >decoded.iat));
        
        if(parseInt(authUser.changePassTime?.getTime()/1000 >decoded.iat)){
            return next(new Error("expierd token"))
        }

        if(!roles.includes(authUser.role)){
            return next(new Error('not authorized user',{cause:403}))
        }
        req.user = authUser;
        return next()
  
    }
}

export default auth