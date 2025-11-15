const express = require("express");
const { protect, isAgent } = require("../middlewares/authMiddleware");
const { 
  addAgentController, 
  getAllAgentController, 
  getSingleAgentController, 
  updateAgentController, 
  getMyAgentsController, 
  LoginAgentController, 
  getCurrentAgentController 
} = require("../controllers/agent.controller");
const { agentProfileUpload } = require("../middlewares/uploadMiddleware"); // Import the middleware

const agentRouter = express.Router();

agentRouter.post("/login", LoginAgentController);
agentRouter.post("/", protect, agentProfileUpload.single('image'), addAgentController); // Add middleware
agentRouter.get("/", isAgent, getCurrentAgentController);
agentRouter.get("/all/:agencyId", getAllAgentController);
agentRouter.get("/my", protect, getMyAgentsController)
agentRouter.get("/:id", getSingleAgentController);
agentRouter.put("/:id", protect, agentProfileUpload.single('image'), updateAgentController); // Add middleware

module.exports = {
    agentRouter
}