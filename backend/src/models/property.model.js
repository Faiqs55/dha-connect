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
      },
      index: { expireAfterSeconds: 0 }
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

// Create TTL index for automatic deletion after 30 days
propertySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Middleware to handle expiration logic
propertySchema.pre('save', function(next) {
  if (!this.expiresAt && !this.isPermanent) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  if (this.isPermanent) {
    this.expiresAt = undefined;
  }
  
  next();
});

// Static method to extend expiration
propertySchema.statics.extendExpiration = function(propertyId, days = 30) {
  return this.findByIdAndUpdate(
    propertyId,
    { 
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      isPermanent: false 
    },
    { new: true }
  );
};

// Static method to make property permanent (no auto-delete)
propertySchema.statics.makePermanent = function(propertyId) {
  return this.findByIdAndUpdate(
    propertyId,
    { 
      expiresAt: undefined,
      isPermanent: true 
    },
    { new: true }
  );
};

// Virtual for days remaining until expiration
propertySchema.virtual('daysRemaining').get(function() {
  if (!this.expiresAt || this.isPermanent) return null;
  const now = new Date();
  const diffTime = this.expiresAt - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Ensure virtual fields are serialized when converting to JSON
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

const Property = mongoose.model("Property", propertySchema);
module.exports = {
  Property,
};