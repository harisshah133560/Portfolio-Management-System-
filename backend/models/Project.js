const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    technologies: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 15;
        },
        message: 'Maximum 15 technologies allowed',
      },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'web-app',
        'mobile-app',
        'desktop-app',
        'api',
        'library',
        'ui-ux',
        'other',
      ],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['completed', 'in-progress', 'planned'],
      default: 'planned',
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveUrl: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for common queries: user + status
projectSchema.index({ user: 1, status: 1 });
// Index for text search
projectSchema.index({
  title: 'text',
  description: 'text',
  technologies: 'text',
});
// Index for sorting
projectSchema.index({ user: 1, createdAt: -1 });
projectSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('Project', projectSchema);