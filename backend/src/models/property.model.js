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
    type: {
      type: String,
      required: true,
      enum: ["residential", "commercial"],
      default: "residential",
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
      default: "none",
    },
    price: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

propertySchema.add({
  paymentPlan: {
    type: String,
    enum: ["yearly", "monthly", "weekly", "daily", "other"],
    required: function () {
      return this.category === "rent";
    },
  },

  residentialTypes: {
    type: String,
    required: function () {
      return this.type === "residential";
    },
  },

  commercialTypes: {
    type: String,
    required: function () {
      return this.type === "commercial";
    },
  },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = {
  Property,
};
