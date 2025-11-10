const mongoose = require("mongoose");

const phaseNameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Phase name is required"],
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("phaseNameModel", phaseNameSchema);


