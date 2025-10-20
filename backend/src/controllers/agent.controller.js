const { Agent } = require("../models/agent.model");

// ADD NEW STAFF MEMBER
const addAgentController = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    if (user.role === "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Admins cannot Manage Agency Staff" });
    }
    data.agency = user.agency;

    const agent = await Agent.create(data);

    if (!agent) {
      return res
        .status(400)
        .json({ success: false, message: "Agent Member could not be created" });
    }

    res.status(201).json({ success: true, message: "Agent member added" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE Agent MEMBER
const getSingleAgentController = async (req, res) => {
  try {
    const id = req.params.iq;
    const agent = await Agent.findById(id);
    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent member does not exist" });
    }

    res.status(200).json({ success: true, data: agent });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL Agent MEMBERS OF AN AGENCY
const getAllAgentController = async (req, res) => {
  try {
    const agencyId = req.params.agencyId;
    const agentMembers = await Agent.find({ agency: agencyId });

    if (agentMembers.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "This agency has no Agent Members" });
    }

    res.status(200).json({ success: true, data: agentMembers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE A Agent MEMBER
const updateAgentController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = req.body;
    if (!(user.role === "agency")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Only Agencies can update Agent members",
        });
    }

    const agent = await Agent.findById(id);

    if (!agent) {
      return res
        .status(404)
        .json({ success: false, message: "Agent Member does not Exist" });
    }

    if (agent.agency !== user.agency) {
      return res
        .status(401)
        .json({
          success: false,
          message: "You can only update your own Agent member",
        });
      }
      const updatedAgent = await agent.updateOne(data);

      if(!updatedAgent){
        return res
        .status(400)
        .json({
          success: false,
          message: "Agent member was not updated",
        });
      }

      res.status(200).json({success: true, data: updatedAgent})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAgentController,
  getAllAgentController,
  getSingleAgentController,
  updateAgentController
};
