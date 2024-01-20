import fs from 'fs';
import multer, { diskStorage } from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the absolute path to the "uploads" folder
const uploadDir = join(__dirname, '/uploads');

// multer
var storage = diskStorage({
  destination: function (req, file, cb) {
    // make sure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  // filename: function (req, file, cb) {
  //   // remove spaces and special characters from original filename
  //   var originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
  //   // set filename to fieldname + current date + original filename
  //   cb(null, file.fieldname + "_" + Date.now() + "_" + originalname);
  // },
  filename: function (req, file, cb) {
    // Remove spaces and special characters from original filename
    var originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
    
    // Generate a random string (e.g., 6 characters) to add uniqueness
    var randomString = Math.random().toString(36).substring(2, 8);
    
    // Combine the random string, current date, and original filename
    cb(null, `${file.fieldname}_${Date.now()}_${randomString}_${originalname}`);
  },
  
});
var upload = multer({
  storage: storage,
}).single('photo');

export default  upload
