const { User } = require("../models/user.model");
const { generateToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

    res.status(200).json({
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

// FORGOT PASSWORD CONTROLLER
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No Account Associated with this email",
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.DHA_CONNECT_JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3_600_00;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL, pass: process.env.EMAIL_PASS },
    });

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      to: user.email,
      subject: "Reset Your Password",
      html: `
           <p>Click <a href="${resetURL}">Here</a> to choose a new password (Link will expire in 1hr).</p>
      `,
    });

    res
      .status(200)
      .json({ success: true, message: "Check your email to reset password." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// RESET PASSWORD CONTROLLER
const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    const { _id } = jwt.verify(token, process.env.DHA_CONNECT_JWT_SECRET);
    const user = await User.findOne({
      _id,
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user)
      res
        .status(401)
        .json({ success: false, message: "Invalid or Expired Token" });

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Your password was updated. Got to Login Page",
      });
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
  getUser,
  forgotPasswordController,
  resetPasswordController
};
