const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
  },

  image: {
    type: String,
    required: true
  },

  name: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
}, {timestamps: true});

const Staff = mongoose.model("Staff", staffSchema);
module.exports = {
    Staff
}


