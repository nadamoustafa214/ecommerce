import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key:"918244843284342",
    api_secret:"uVyysBks24ic5kAT7u4OMFBI6hM",
    cloud_name:"dheurplxu",
    secure: true
})

export default cloudinary.v2;