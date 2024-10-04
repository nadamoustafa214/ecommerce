import {roles} from './../../middleware/auth.js'

export const endPoint={
    create:[roles.user],
    changeStatus:[roles.admin],
    cancelOrder:[roles.user]
}