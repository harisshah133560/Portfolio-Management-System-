const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const normalizeAssetUrl = (value) => {
  if (!value || typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  if (/^https?:\/\//i.test(trimmedValue)) {
    try {
      const parsedUrl = new URL(trimmedValue);
      const normalizedPath = parsedUrl.pathname.replace(/^\/api/, "");
      return normalizedPath.startsWith("/uploads") ? normalizedPath : trimmedValue;
    } catch (error) {
      return trimmedValue;
    }
  }

  if (trimmedValue.startsWith("uploads/")) {
    return `/${trimmedValue}`;
  }

  return trimmedValue;
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

exports.register = async function (req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const normalizedEmail = String(email).toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists",
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error creating account",
    });
  }
};

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    const safeUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

exports.getMe = async function (req, res) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error fetching profile",
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    const allowedFields = [
      "name",
      "bio",
      "location",
      "website",
      "headline",
      "role",
      "githubUrl",
      "linkedinUrl",
      "emailAddress",
      "about",
      "cvUrl",
      "avatar",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === "avatar" || field === "cvUrl"
          ? normalizeAssetUrl(req.body[field])
          : req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      data: user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error updating profile",
    });
  }
};

exports.changePassword = async function (req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error changing password",
    });
  }
};

exports.uploadAvatar = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No avatar file uploaded",
      });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: { avatar: user.avatar },
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error uploading avatar",
    });
  }
};

exports.uploadCv = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CV file uploaded",
      });
    }

    const cvUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cvUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: { cvUrl: user.cvUrl },
      message: "CV uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error uploading CV",
    });
  }
};

exports.deleteAccount = async function (req, res) {
  try {
    await Promise.all([
      User.findByIdAndDelete(req.user._id),
      Project.deleteMany({ user: req.user._id }),
    ]);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error deleting account",
    });
  }
};

exports.getPublicProfile = async function (req, res) {
  try {
    const userId = req.params.userId || req.query.userId;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({}).sort({ createdAt: -1 });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error fetching public profile",
    });
  }
};