import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

export const sendImageToCloudinary = async (imageName: string, path: string) => {







    // Configuration
    cloudinary.config({
        cloud_name: config.cloudinary_cloud_name,
        api_key: config.cloudinary_api_key,
        api_secret: config.cloudinary_api_secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader
        .upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
            public_id: 'shoes',
        }
        )
        .catch((error) => {
            console.log(error);
        });


};




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd()+'/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })