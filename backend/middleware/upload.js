const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Upload directory
const uploadDir = path.join(__dirname, "..", "uploads");

// Create uploads folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ===============================
// Storage Configuration
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

// ===============================
// File Filter
// ===============================
const fileFilter = (req, file, cb) => {
  const allowedImages = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
  ];

  const allowedDocs = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  // CV Upload
  if (file.fieldname === "cv") {
    if (allowedDocs.includes(file.mimetype)) {
      return cb(null, true);
    }

    return cb(
      new Error("Only PDF or Word documents are allowed."),
      false
    );
  }

  // Image Upload
  if (allowedImages.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new Error("Only image, PDF or Word files are allowed."),
    false
  );
};

// ===============================
// Multer Instance
// ===============================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
  },
});

module.exports = upload;