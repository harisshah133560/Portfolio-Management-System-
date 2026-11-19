const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

const normalizeAssetUrl = (value) => {
  if (!value || typeof value !== "string") return value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  if (trimmedValue.startsWith("data:image/")) {
    return trimmedValue;
  }

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

exports.register = async function (req, res, next) {
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
    next(error);
  }
};

exports.login = async function (req, res, next) {
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
    next(error);
  }
};

exports.getMe = async function (req, res, next) {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async function (req, res, next) {
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
    next(error);
  }
};

exports.changePassword = async function (req, res, next) {
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
    next(error);
  }
};

exports.uploadAvatar = async function (req, res, next) {
  try {
    let avatarUrl = "";
    if (req.file) {
      avatarUrl = `/uploads/${req.file.filename}`;
    } else if (req.body && req.body.avatar) {
      avatarUrl = normalizeAssetUrl(req.body.avatar);
    } else {
      return res.status(400).json({
        success: false,
        message: "No avatar file or URL provided",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      data: { avatar: user.avatar, user },
      message: "Avatar uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadCv = async function (req, res, next) {
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
      data: { cvUrl: user.cvUrl, user },
      message: "CV uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAccount = async function (req, res, next) {
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
    next(error);
  }
};

exports.getPublicProfile = async function (req, res, next) {
  try {
    const userId = req.params.userId || req.query.userId;
    let user = null;

    if (userId) {
      user = await User.findById(userId).select("-password");
    } else if (process.env.ADMIN_EMAIL) {
      user = await User.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase().trim() }).select("-password");
    }

    if (!user) {
      // Prioritize the user who has active profile details configured, most recently updated
      user = await User.findOne({
        $or: [
          { cvUrl: { $exists: true, $ne: "" } },
          { headline: { $exists: true, $ne: "" } },
          { about: { $exists: true, $ne: "" } },
        ],
      })
        .sort({ updatedAt: -1 })
        .select("-password");
    }

    if (!user) {
      user = await User.findOne({}).sort({ updatedAt: -1 }).select("-password");
    }

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
    next(error);
  }
};