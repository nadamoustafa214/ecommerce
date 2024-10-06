import mongoose, { Schema, Types, model } from "mongoose";

const userSchema = new Schema({
    firstName:String,
    lastName:String,
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
        required:true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    gender: {
        type: String,
        default: 'male',
        enum: ['male', 'female']
    },
    status: {
        type: String,
        default: 'offline',
        enum:['online','offline','blocked']
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    address:String,
    image: Object,
    DOB: String,
    code:{
        type:Number,
        default:null
    },
    changePassTime:Date,
    wishList:[{type:Types.ObjectId,ref:'Product'}]
}, {
    timestamps: true
})


const userModel = mongoose.model.User || model('User', userSchema)
export default userModel