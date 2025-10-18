const express = require("express");
const { createUserController, userLoginController } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.route("/")
.post(createUserController);

userRouter.post("/login", userLoginController);

module.exports = {userRouter}