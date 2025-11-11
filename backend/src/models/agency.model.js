const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: true,
    },
    agencyEmail: {
      type: String,
      required: [true, "Agency e-mail is mandatory"],
      unique: true,
      validate: {
        validator: (v) => v && v.trim().length > 0,
        message: "Agency e-mail cannot be empty",
      },
    },
    password: {
      type: String,
      required: true
    },
   
    ceoName: {
      type: String,
      required: true,
    },
    ceoPhone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },
    phase: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },

    facebook: {
      type: String,
    },
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    agencyLogo: {
      type: String,
      required: true,
    },
    agencyVideo: {
      type: String,
    },
    about: {
      type: String
    },
    website: {
      type: String
    },

    // ADMIN FIELDS 
     status: {
      type: String,
      required: true,
      enum: ["Approved", "Pending", "Blocked", "Rejected"],
      default: "Pending"
    },
    classifiedAds: {
        type: Number,
        required: true,
        default: 20
    },
    videoAds: {
        type: Number,
        required: true,
        default: 0
    },
    featuredAds: {
        type: Number,
        required: true,
        default: 0
    },
  },
  { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);
module.exports = { Agency };
