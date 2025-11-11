const mongoose = require("mongoose");

const electedBodySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    whatsappNo: {
      type: String,
      trim: true,
    },
    agencyBelong: {
      type: String,
      trim: true,
    },
    profileSummary: {
      type: String,
      trim: true,
    },
    uploadVideo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["current", "old"],
      default: "current",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ElectedBody = mongoose.model("ElectedBody", electedBodySchema);

module.exports = {
  ElectedBody,
};

