import * as dotenv from 'dotenv'
dotenv.config()
import cloudinary from 'cloudinary';


cloudinary.v2.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET_KEY,
    cloud_name:process.env.dheurplxu,
    secure: true
})

export default cloudinary.v2;