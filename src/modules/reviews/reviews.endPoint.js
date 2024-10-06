import { roles } from "../../middleware/auth.js";

export const endPoint={
    create:[roles.user],
    update:[roles.user],
    delete:[roles.user]
}