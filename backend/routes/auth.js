const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

// ===============================
// Public Routes
// ===============================

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Public Portfolio Profile
router.get("/public-profile", authController.getPublicProfile);
router.get("/public-profile/:userId", authController.getPublicProfile);

// ===============================
// Protected Routes
// ===============================

// Logged-in User
router.get("/me", protect, authController.getMe);

// Update Profile
router.put("/profile", protect, authController.updateProfile);

// Change Password
router.put("/password", protect, authController.changePassword);

// Upload Avatar
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  authController.uploadAvatar
);

// Upload CV
router.post(
  "/cv",
  protect,
  upload.single("cv"),
  authController.uploadCv
);

// Delete Account
router.delete("/account", protect, authController.deleteAccount);

module.exports = router;