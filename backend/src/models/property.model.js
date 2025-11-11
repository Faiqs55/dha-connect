const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    agent: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
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
    thumbnailImage: {
       type: String,
       required: true
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
      enum: ["Sell", "Rent", "Project"],
    },
    type: {
      type: String,
      required: true,
      enum: ["residential", "plot", "commercial"],
      default: "residential",
    },
    subType: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true,
    },
    areaUnit: {
      type: String,
      required: true
    },
    bathrooms: {
      type: String,
    },
    bedrooms: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "sold", "pending"],
      default: "available",
    },
    otherFeatures: {
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
    plotAmenities: {
      type: String,
    },
    plotFileType: {
      type: String,
    }
  },
  { timestamps: true }
);

propertySchema.add({
  paymentPlan: {
    type: String,
    enum: ["Yearly", "Monthly", "Weekly", "Daily", "Other"],
    required: function () {
      return this.category === "rent";
    },
  },
});

const Property = mongoose.model("Property", propertySchema);
module.exports = {
  Property,
};
