const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: true,
    },
    agencyEmail: {
      type: String,
      required: true,
      unique: true,
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
    logo: {
      type: String,
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
        staffImg: {
          type: String,
        },
      },
    ],
  },
  {timestamps: true}
) ;

const Agency = mongoose.model("Agency", agencySchema);
module.exports = { Agency };
