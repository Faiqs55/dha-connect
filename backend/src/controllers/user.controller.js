const { Agency } = require("../models/agency.model");
const { User } = require("../models/user.model");
const { generateToken } = require("../utils/generateToken");

const createUserController = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.create(body);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Failed to Create User" });
    }
    res
      .status(201)
      .json({ success: true, message: "User Created", data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Email Address" });
    }

    if (!(password && user.matchPassword(password))) {
      return res
        .status(403)
        .json({ success: false, message: "Incorrect Password." });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Authentication Complete",
        data: { token: generateToken(user._id) },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUserController,
  userLoginController,
  getUser
};
