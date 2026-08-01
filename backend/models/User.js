const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    avatar: {
      type: String,
      default: null,
      trim: true,
    },

    bio: {
      type: String,
      default: "",
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
    },

    location: {
      type: String,
      default: "",
      maxlength: [100, "Location cannot exceed 100 characters"],
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    headline: {
      type: String,
      default: "",
      maxlength: [120, "Headline cannot exceed 120 characters"],
      trim: true,
    },

    role: {
      type: String,
      default: "",
      maxlength: [80, "Role cannot exceed 80 characters"],
      trim: true,
    },

    githubUrl: {
      type: String,
      default: "",
      trim: true,
    },

    linkedinUrl: {
      type: String,
      default: "",
      trim: true,
    },

    emailAddress: {
      type: String,
      default: "",
      trim: true,
    },

    about: {
      type: String,
      default: "",
      maxlength: [1000, "About cannot exceed 1000 characters"],
      trim: true,
    },

    cvUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },

    toObject: {
      virtuals: true,
    },
  }
);

// ===============================
// Password Hashing
// ===============================
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ===============================
// Compare Password
// ===============================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ===============================
// Virtual ID
// ===============================
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model("User", userSchema);