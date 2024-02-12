import multer from "multer";

// storage function which stores the file locally in public/test
// and gives us a local pathName
const storage = multer.diskStorage({
    destination: function (req, file, cb) {     // cb := callback
      cb(null, "./public/test")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage, })