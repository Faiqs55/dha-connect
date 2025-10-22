const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: {
      required: true,
      type: String,
      enum: ["admin", "agency"],
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency"
    },
    resetToken: String,
    resetTokenExpiry: Date
  },
  { timestamps: true }
);


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (pass) {
    return await bcrypt.compare(pass, this.password)
}

const User = mongoose.model("User", userSchema);
module.exports = { User };
