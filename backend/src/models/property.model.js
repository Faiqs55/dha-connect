const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    agent: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    agency: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one image link is required",
      },
    },

    video: {
      type: String,
    },
    phase: {
      required: true,
      type: String,
    },
    address: {
      required: true,
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ["buy", "rent", "project"],
    },
    size: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "sold"],
      default: "available",
    },
    features: {
      type: [String],
    },
    adType: {
        type: String,
        enum: ["classifiedAds", "videoAds", "featuredAds", "none"],
        default: "none"
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = {
  Property,
};
