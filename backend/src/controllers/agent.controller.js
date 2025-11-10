const { Agency } = require("../models/agency.model");
const { Agent } = require("../models/agent.model");
const { generateToken } = require("../utils/generateToken");

const LoginAgentController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email: email });

    if (!agent) {
      return res.status(404).json({ success: false, message: "Invalid Email" });
    }

    const passwordIsCorrect = await agent.matchPassword(password);
    if (!passwordIsCorrect) {
      return res
        .status(403)
        .json({ success: false, message: "Incorrect Password." });
    }

    res.status(200).json({
      success: true,
      message: "Login Successfull",
      data: { token: generateToken(agent._id), role: "agent" },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCurrentAgentController = async (req, res) => {
  try {
    const agent = req.agent;
    res.status(200).json({ success: true, data: { agent, role: "agent" } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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
    const agency = await Agency.findById(user.agency);
    if (
      agency.classifiedAds < data.classifiedAds ||
      agency.videoAds < data.videoAds ||
      agency.featuredAds < data.featuredAds
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You don't have enough ads." });
    }

    const agent = await Agent.create(data);

    if (!agent) {
      return res
        .status(400)
        .json({ success: false, message: "Agent Member could not be created" });
    }

    agency.classifiedAds = agency.classifiedAds - agent.classifiedAds;
    agency.videoAds = agency.videoAds - agent.videoAds;
    agency.featuredAds = agency.featuredAds - agent.featuredAds;

    await agency.save();

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
    const id = req.params.id;
    const agent = await Agent.findById(id).select("-password");
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

const getMyAgentsController = async (req, res) => {
  try {
    const query = req.query || {};
    if (query.name) {
      query.name = { $regex: query.name, $options: "i" };
    }
    const agencyID = req.user.agency;
    const agents = await Agent.find({ ...query, agency: agencyID }).select(
      "-password"
    );

    res.status(200).json({ success: true, data: agents });
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
    const agentMembers = await Agent.find({ agency: agencyId }).select(
      "-password"
    );

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
    let newAgencyClassifiedAds;
    let newAgencyVideoAds;
    let newAgencyFeaturedAds;
    if (!(user.role === "agency")) {
      return res.status(401).json({
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
    
    

    const agency = await Agency.findById(user.agency);
    if (
      agency.classifiedAds < data.classifiedAds ||
      agency.videoAds < data.videoAds ||
      agency.featuredAds < data.featuredAds
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You don't have enough ads." });
    }

    newAgencyClassifiedAds =
      agency.classifiedAds - (data.classifiedAds - agent.classifiedAds);
    newAgencyVideoAds = agency.videoAds - (data.videoAds - agent.videoAds);
    newAgencyFeaturedAds =
      agency.featuredAds - (data.featuredAds - agent.featuredAds);

    if (agent.agency.toString() !== user.agency.toString()) {
      return res.status(401).json({
        success: false,
        message: "You can only update your own Agent member",
      });
    }

    const updatedAgent = await agent.updateOne(data);

    if (!updatedAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent member was not updated",
      });
    }

    await agency.updateOne({
      classifiedAds: newAgencyClassifiedAds,
      videoAds: newAgencyVideoAds,
      featuredAds: newAgencyFeaturedAds,
    });

    res.status(200).json({
      success: true,
      data: updatedAgent,
      message: "Agent has been updated",
    });
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
  updateAgentController,
  getMyAgentsController,
  LoginAgentController,
  getCurrentAgentController,
};
