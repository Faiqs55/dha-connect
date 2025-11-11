const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const { Agent } = require("../models/agent.model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.DHA_CONNECT_JWT_SECRET);
      const user = await User.findById(decoded._id).select("-password");

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Authentication Failed", role: "user" });
      }
      req.user = user;
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token Failed. Login Again", role: "user" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No Token Available. Please Login", role: "user" });
  }
};

const isAgent = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.DHA_CONNECT_JWT_SECRET);
      const agent = await Agent.findById(decoded._id).select("-password");

      if (!agent) {
        return res
          .status(404)
          .json({ success: false, message: "Authentication Failed", role: "agent" });
      }
      req.agent = agent;
      return next();
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token Failed. Login Again", role: "agent" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No Token Available. Please Login", role: "agent" });
  }
};

module.exports = {
  protect,
  isAgent,
};
