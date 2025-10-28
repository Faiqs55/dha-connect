const express = require("express");
const { protect, isAgent } = require("../middlewares/authMiddleware");
const { addAgentController, getAllAgentController, getSingleAgentController, updateAgentController, getMyAgentsController, LoginAgentController, getCurrentAgentController } = require("../controllers/agent.controller");
const agentRouter = express.Router();

agentRouter.post("/login", LoginAgentController);
agentRouter.post("/", protect, addAgentController);
agentRouter.get("/", isAgent, getCurrentAgentController);
agentRouter.get("/all/:agencyId", getAllAgentController);
agentRouter.get("/my", protect, getMyAgentsController)
agentRouter.get("/:id", getSingleAgentController);
agentRouter.put("/:id", protect, updateAgentController);

module.exports = {
    agentRouter
}