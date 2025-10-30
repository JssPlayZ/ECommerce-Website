import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // Save files to the 'uploads/' directory
    },
    filename(req, file, cb) {
        // Create a unique filename (fieldname + timestamp + original extension)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter to accept only image formats
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// @desc    Handle image upload
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', upload.single('image'), (req, res) => {
    // The 'upload.single('image')' middleware will process the file.
    // 'image' must match the key in the FormData from the frontend.
    
    // If successful, req.file will contain file info.
    // We return the path to the frontend.
    if (req.file) {
        // We replace backslashes with forward slashes for cross-platform web compatibility
        const imagePath = `/${req.file.path.replace(/\\/g, "/")}`;
        res.send({
            message: 'Image Uploaded Successfully',
            image: imagePath,
        });
    } else {
        res.status(400).send({ message: 'No file provided or invalid file type.' });
    }
});

export default router;