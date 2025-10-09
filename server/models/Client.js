const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    program: {
      type: String,
      required: [true, 'Program is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    clientSince: {
      type: String,
      required: [true, 'Client since date is required'],
    },
    status: {
      type: String,
      enum: ['active', 'past'],
      default: 'active',
    },
    photos: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
clientSchema.index({ status: 1 });
clientSchema.index({ name: 1 });
clientSchema.index({ status: 1, createdAt: -1 });
clientSchema.index({ createdBy: 1, status: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;

