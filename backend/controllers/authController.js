const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = function (id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

exports.register = async function (req, res) {
  try {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    var user = await User.create({ name: name, email: email, password: password });
    var token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          website: user.website,
          headline: user.headline,
          role: user.role,
          githubUrl: user.githubUrl,
          linkedinUrl: user.linkedinUrl,
          emailAddress: user.emailAddress,
          about: user.about,
          createdAt: user.createdAt,
        },
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

exports.login = async function (req, res) {
  try {
    var email = req.body.email;
    var password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    var user = await User.findOne({ email: email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email',
      });
    }

    var isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password',
      });
    }

    var token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          website: user.website,
          headline: user.headline,
          role: user.role,
          githubUrl: user.githubUrl,
          linkedinUrl: user.linkedinUrl,
          emailAddress: user.emailAddress,
          about: user.about,
          createdAt: user.createdAt,
        },
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

exports.getMe = async function (req, res) {
  try {
    var user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
    });
  }
};

exports.getPublicProfile = async function (req, res) {
  try {
    var user = await User.findOne({}).select('name headline role githubUrl linkedinUrl emailAddress about avatar bio location website cvUrl createdAt');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching public profile',
    });
  }
};

exports.updateProfile = async function (req, res) {
  try {
    var name = req.body.name;
    var bio = req.body.bio;
    var location = req.body.location;
    var website = req.body.website;
    var avatar = req.body.avatar;
    var headline = req.body.headline;
    var role = req.body.role;
    var githubUrl = req.body.githubUrl;
    var linkedinUrl = req.body.linkedinUrl;
    var emailAddress = req.body.emailAddress;
    var about = req.body.about;
    var cvUrl = req.body.cvUrl;

    var updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (headline !== undefined) updateData.headline = headline;
    if (role !== undefined) updateData.role = role;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (emailAddress !== undefined) updateData.emailAddress = emailAddress;
    if (about !== undefined) updateData.about = about;
    if (cvUrl !== undefined) updateData.cvUrl = cvUrl;

    var user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
    });
  }
};

exports.changePassword = async function (req, res) {
  try {
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;

    var user = await User.findById(req.user._id).select('+password');

    var isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    var token = generateToken(user._id);

    res.json({
      success: true,
      data: { token: token },
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error changing password',
    });
  }
};

exports.uploadAvatar = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      });
    }

    var avatarPath = '/uploads/' + req.file.filename;

    var user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarPath },
      { new: true }
    );

    res.json({
      success: true,
      data: { avatar: user.avatar },
      message: 'Avatar uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error uploading avatar',
    });
  }
};

exports.uploadCv = async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF or document file',
      });
    }

    var cvPath = '/uploads/' + req.file.filename;

    var user = await User.findByIdAndUpdate(
      req.user._id,
      { cvUrl: cvPath },
      { new: true }
    );

    res.json({
      success: true,
      data: { cvUrl: user.cvUrl },
      message: 'CV uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error uploading CV',
    });
  }
};

exports.deleteAccount = async function (req, res) {
  try {
    var Project = require('../models/Project');
    await Project.deleteMany({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Account and all associated data deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting account',
    });
  }
};