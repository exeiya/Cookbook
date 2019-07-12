require('dotenv').config();

let CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
let CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

module.exports = {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET
};