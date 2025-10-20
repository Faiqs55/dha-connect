const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addAgentController, getAllAgentController, getSingleAgentController, updateAgentController } = require("../controllers/agent.controller");
const agentRouter = express.Router();

agentRouter.post("/", protect, addAgentController);
agentRouter.get("/all/:agencyId", getAllAgentController);
agentRouter.get("/:id", getSingleAgentController);
agentRouter.put("/:id", protect, updateAgentController);

module.exports = {
    agentRouter
}