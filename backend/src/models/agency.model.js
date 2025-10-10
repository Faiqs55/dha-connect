const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agencyInfo: {
      agencyName: {
        type: String,
        required: true,
      },
      agencyEmail: {
        type: String,
        required: true,
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
    },

    location: {
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
    },

    socials: {
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
    },
    images: {
      agencyLogo: {
        type: String,
        required: true,
      },
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

// {
//   "agencyInfo": {
//     "agencyName": "Dsden",
//     "agencyEmail": "info@dsden.com",
//     "ceoName": "Faiq",
//     "ceoPhone1": "03253550555",
//     "ceoPhone2": "",
//     "whatsapp": "+92 3253550555"
//   },
//   "location": {
//     "city": "",
//     "phase": "",
//     "streetAddress": "209-A Rizwan Block Awan Town"
//   },
//   "socials": {
//     "facebook": "",
//     "youtube": "",
//     "twitter": "",
//     "instagram": ""
//   },
//   "about": {
//     "about": "",
//     "website": ""
//   },
//   "images": {
//     "agencyLogo": "https://res.cloudinary.com/dhdgrfseu/image/upload/v1760103680/pk2kzpcvbxcab1yhrhfq.png"
//   },
//   "staff": [
//     {
//       "staffName": "Faiq",
//       "staffDesignation": "CEO",
//       "staffPhone": "02020202",
//       "staffImageUrl": "https://res.cloudinary.com/dhdgrfseu/image/upload/v1760103686/cixt1cd56hleogllgiaj.jpg"
//     }
//   ]
// }
