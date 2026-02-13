import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.COUDINARY_CLOUD_NAME,
    api_key: process.env.COUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer); // 🔥 yahin actual file ja rahi hai
  });
};

export const deleteCloudinaryImages = (public_ids=[])=>{
  public_ids?.map(id=>{
    cloudinary.uploader.destroy(id);
  })
}
