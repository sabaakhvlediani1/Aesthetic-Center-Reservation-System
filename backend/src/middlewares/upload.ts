import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "public/uploads/staff";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `staff-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});


const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isExtensionAllowed = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isMimeAllowed = allowedTypes.test(file.mimetype);

  if (isExtensionAllowed && isMimeAllowed) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png, webp) are allowed!"));
};

export const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});