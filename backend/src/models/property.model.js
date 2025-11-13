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
    block: {
      type: String,
      required: true,
    },
    plot: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
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
      enum: ["Houses", "Plots", "Files", "Commercial"],
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
      required: true,
      enum: ["Marla", "Sq. Ft.", "Sq. M.", "Sq. Yd.", "Kanal"]
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
      type: [String],
    },
    plotFileType: {
      type: String,
    },
    plotNumber: {
      type: String,
    },
    expiresAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
      // ❌ REMOVED: index: { expireAfterSeconds: 0 }
    },
    isPermanent: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

propertySchema.add({
  paymentPlan: {
    type: String,
    enum: ["Yearly", "Monthly", "Weekly", "Daily", "Other"],
    required: function () {
      return this.category === "Rent";
    },
  },
});

// ✅ KEEP ONLY THIS TTL INDEX (remove the duplicate field-level index)
propertySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Rest of your schema remains the same...
propertySchema.pre('save', function(next) {
  if (!this.expiresAt && !this.isPermanent) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  if (this.isPermanent) {
    this.expiresAt = undefined;
  }
  
  next();
});

// ... rest of your static methods and virtuals remain unchanged

const Property = mongoose.model("Property", propertySchema);
module.exports = {
  Property,
};