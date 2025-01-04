import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import config from '../config';
import multer from 'multer';

// Configuration
cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret
});


export const sendImageToCloudinary = (
    imageName: string,
    path: string,
): Promise<Record<string, unknown>> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            path,
            { public_id: imageName.trim() },
            function (error, result) {
                if (error) {
                    reject(error);
                }
                resolve(result as UploadApiResponse);
                // delete a file asynchronously
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File is deleted.');
                    }
                });
            },
        );
    });
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({ storage: storage })