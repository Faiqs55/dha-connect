const express = require("express");
const { createUserController, userSignupController, userLoginController, getUser, forgotPasswordController, resetPasswordController } = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

userRouter.route("/")
.post(createUserController)
.get(protect, getUser);

userRouter.post("/signup", userSignupController);
userRouter.post("/login", userLoginController);
userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/reset-password", resetPasswordController);

module.exports = {userRouter}