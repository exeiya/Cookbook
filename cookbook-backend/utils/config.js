require('dotenv').config();

let CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
let CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
let PORT = process.env.PORT;
let MONGODB_URI = process.env.MONGODB_URI;

if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = process.env.TEST_MONGODB_URI;
}

module.exports = {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  PORT,
  MONGODB_URI
};