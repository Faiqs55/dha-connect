const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const agentSchema = new mongoose.Schema({
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
  },

  image: {
    type: String,
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
  },
  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
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

}, {timestamps: true});


agentSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

agentSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}


const Agent = mongoose.model("Agent", agentSchema);
module.exports = {
    Agent
}


