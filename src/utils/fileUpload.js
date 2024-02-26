import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// throws error otherwise
import dotenv from "dotenv";    
dotenv.config({     // configure dotenv
    path: "./.env"  // set path of env
});

// configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });

// fileUpload function takes localFilePath and uploads on cloudinary service
const fileUpload = async(localFilePath) => {
    try {
        if(!localFilePath) {
            console.log("path issues")
            return null;
        }
        // console.log(localFilePath);
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file has been uploaded successfully
        // console.log("File has been uploaded successfully!!", response.url);
        return response;
    } catch (error) {
        // console.log(error);
        fs.unlinkSync(localFilePath); // remove the locally saved temporary file, as the upload operation got failed
        return null;
    }
}
export { fileUpload };