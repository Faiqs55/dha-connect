const { Agency } = require("../models/agency.model");
const { Agent } = require("../models/agent.model");
const { generateToken } = require("../utils/generateToken");
const fs = require('fs');
const path = require('path');


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
    
    // Check if agency has enough ads to allocate to agent
    if (
      (data.classifiedAds && agency.classifiedAds < data.classifiedAds) ||
      (data.videoAds && agency.videoAds < data.videoAds) ||
      (data.featuredAds && agency.featuredAds < data.featuredAds)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You don't have enough ads to allocate." });
    }

    // Handle file upload if image was uploaded
    if (req.file) {
      data.image = req.file.path; // Multer saves the file and we get the path
    }

    const agent = await Agent.create(data);

    if (!agent) {
      return res
        .status(400)
        .json({ success: false, message: "Agent Member could not be created" });
    }

    // Deduct allocated ads from agency
    if (data.classifiedAds) {
      agency.classifiedAds = agency.classifiedAds - data.classifiedAds;
    }
    if (data.videoAds) {
      agency.videoAds = agency.videoAds - data.videoAds;
    }
    if (data.featuredAds) {
      agency.featuredAds = agency.featuredAds - data.featuredAds;
    }

    await agency.save();

    res.status(201).json({ 
      success: true, 
      message: "Agent member added",
      data: {
        agent: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          classifiedAds: agent.classifiedAds,
          videoAds: agent.videoAds,
          featuredAds: agent.featuredAds,
          image: agent.image // Include the image path
        },
        agencyRemainingAds: {
          classifiedAds: agency.classifiedAds,
          videoAds: agency.videoAds,
          featuredAds: agency.featuredAds
        }
      }
    });
  } catch (error) {
    // Clean up uploaded file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
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

    if (agent.agency.toString() !== user.agency.toString()) {
      return res.status(401).json({
        success: false,
        message: "You can only update your own Agent member",
      });
    }

    // Handle file upload if new image was uploaded
    if (req.file) {
      // Delete old image file if it exists
      if (agent.image && fs.existsSync(agent.image)) {
        fs.unlinkSync(agent.image);
      }
      data.image = req.file.path; // Set new image path
    }

    const agency = await Agency.findById(user.agency);
    
    // Calculate the difference in ad allocation
    const classifiedDiff = (data.classifiedAds || 0) - agent.classifiedAds;
    const videoDiff = (data.videoAds || 0) - agent.videoAds;
    const featuredDiff = (data.featuredAds || 0) - agent.featuredAds;

    // Check if agency has enough ads for the update
    if (
      (classifiedDiff > 0 && agency.classifiedAds < classifiedDiff) ||
      (videoDiff > 0 && agency.videoAds < videoDiff) ||
      (featuredDiff > 0 && agency.featuredAds < featuredDiff)
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You don't have enough ads to allocate." });
    }

    // Update agency ads based on the difference
    if (classifiedDiff !== 0) {
      agency.classifiedAds = agency.classifiedAds - classifiedDiff;
    }
    if (videoDiff !== 0) {
      agency.videoAds = agency.videoAds - videoDiff;
    }
    if (featuredDiff !== 0) {
      agency.featuredAds = agency.featuredAds - featuredDiff;
    }

    // Update agent with new data
    const updatedAgent = await Agent.findByIdAndUpdate(
      id, 
      data, 
      { new: true }
    ).select("-password");

    if (!updatedAgent) {
      return res.status(400).json({
        success: false,
        message: "Agent member was not updated",
      });
    }

    await agency.save();

    res.status(200).json({
      success: true,
      data: {
        agent: updatedAgent,
        agencyRemainingAds: {
          classifiedAds: agency.classifiedAds,
          videoAds: agency.videoAds,
          featuredAds: agency.featuredAds
        }
      },
      message: "Agent has been updated",
    });
  } catch (error) {
    // Clean up uploaded file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
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
