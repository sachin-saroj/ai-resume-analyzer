const multer = require('multer');
const path = require('path');

// Multer storage config - keeping it in memory for serverless/buffer processing
const storage = multer.memoryStorage();

// File filter for sanitization and security
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX are allowed.'), false);
  }
};

// Protect from memory exhaustion and DDOS via large files
const limits = {
  fileSize: 5 * 1024 * 1024 // 5 MB strictly
};

const uploadParser = multer({ storage, fileFilter, limits });

// Error handling wrapper for Multer limits
const secureUpload = (req, res, next) => {
  const upload = uploadParser.single('resume');
  
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
         return res.status(400).json({ success: false, message: 'File is too large. Max size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    // Everything went fine.
    next();
  });
};

module.exports = { secureUpload };
