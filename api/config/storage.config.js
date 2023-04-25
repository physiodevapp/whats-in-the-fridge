const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
  // secure: true
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',  
    allowed_formats: ["jpg","png"],
    format: 'jpg', // instruct Cloudinary to convert rejected formats to another one
    public_id: (req, file) => {
      return req.product.id // must be unique :)
    }
  }
})

module.exports = multer({ storage: storage })