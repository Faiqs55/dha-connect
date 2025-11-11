const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema(
  {
    phaseName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "phaseNameModel",
      required: [true, "Phase name is required"],
    },
    categoryType: {
      type: String,
      enum: ["Allocation", "Affidavit"],
      default: "Allocation",
    },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial"],
      default: "Residential",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    ratePKR: {
      type: Number,
      required: [true, "PKR rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    rateUSD: {
      type: Number,
      required: [true, "USD rate is required"],
      min: [0, "Rate cannot be negative"],
    },
    currencyType: {
      type: String,
      enum: ["PKR", "USD", "BOTH"],
      default: "BOTH",
    },
    lastUpdated: {
      type: Date,
      required: [true, "Last updated date is required"],
    },
    status: {
      type: String,
      enum: ["new", "old"],
      default: "new",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for efficient queries by phase name (non-unique to allow multiple entries)
phaseSchema.index({ phaseName: 1, lastUpdated: -1 }, { unique: false });
phaseSchema.index({ phaseName: 1, description: 1 }, { unique: false });

module.exports = mongoose.model("Phase", phaseSchema);

