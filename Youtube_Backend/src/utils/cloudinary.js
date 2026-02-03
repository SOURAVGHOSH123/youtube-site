import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;
      // upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto"
      })
      // file upload successfully
      // console.log("File is uplosd successfully", response.url)
      // console.log(response, "full response")
      fs.unlinkSync(localFilePath)
      return response
   } catch (error) {
      fs.unlinkSync(localFilePath) // removed the locally save temporary file after the
      // upload operation got failed
      console.log("cloudinary upload error!!", error)
      return null
   }
}

export { uploadFileCloudinary }


// cloudinary.uploader
//    .upload("my_image.jpg")
//    .then(result => console.log(result));