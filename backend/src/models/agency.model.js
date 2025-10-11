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
    ceoName: {
      type: String,
      required: true,
    },
    ceoPhone1: {
      type: String,
      required: true,
    },
    ceoPhone2: {
      type: String,
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
    streetAddress: {
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
    staff: [
      {
        staffName: {
          type: String,
          required: true,
        },
        staffDesignation: {
          type: String,
        },
        staffPhone: {
          type: String,
        },
        staffImageUrl: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Agency = mongoose.model("Agency", agencySchema);
module.exports = { Agency };
