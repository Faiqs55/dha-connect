const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
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

const Agent = mongoose.model("Agent", agentSchema);
module.exports = {
    Agent
}


