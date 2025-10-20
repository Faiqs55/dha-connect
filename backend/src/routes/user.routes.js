const express = require("express");
const { createUserController, userLoginController, getUser } = require("../controllers/user.controller");
const { protect } = require("../middlewares/authMiddleware");
const userRouter = express.Router();

userRouter.route("/")
.post(createUserController)
.get(protect, getUser);

userRouter.post("/login", userLoginController);

module.exports = {userRouter}