const { Agency } = require("../models/agency.model");
const { Agent } = require("../models/agent.model");
const { Property } = require("../models/property.model");
const { User } = require("../models/user.model");
const path = require('path');
const fs = require('fs');

// ADD NEW AGENCY
const addAgencyController = async (req, res) => {
  try {
    const data = req.body;
    
    // Handle file paths if files were uploaded
    if (req.files) {
      // Process logo file
      if (req.files.agencyLogo) {
        const logoFile = req.files.agencyLogo[0];
        const agencyName = data.agencyName ? data.agencyName.replace(/\s+/g, '-') : 'agency';
        const logoExtension = path.extname(logoFile.originalname);
        const logoFilename = `${agencyName}-logo-${Date.now()}${logoExtension}`;
        const logoPath = `uploads/agency/logo/${logoFilename}`;
        
        // Move file to correct location with new name
        fs.renameSync(logoFile.path, logoPath);
        data.agencyLogo = logoPath;
      }

      // Process video file
      if (req.files.agencyVideo) {
        const videoFile = req.files.agencyVideo[0];
        const agencyName = data.agencyName ? data.agencyName.replace(/\s+/g, '-') : 'agency';
        const videoExtension = path.extname(videoFile.originalname);
        const videoFilename = `${agencyName}-video-${Date.now()}${videoExtension}`;
        const videoPath = `uploads/agency/video/${videoFilename}`;
        
        // Move file to correct location with new name
        fs.renameSync(videoFile.path, videoPath);
        data.agencyVideo = videoPath;
      }
    }

    const agency = await Agency.create(data);
    if (!agency) {
      // Clean up uploaded files if agency creation failed
      if (data.agencyLogo && fs.existsSync(data.agencyLogo)) {
        fs.unlinkSync(data.agencyLogo);
      }
      if (data.agencyVideo && fs.existsSync(data.agencyVideo)) {
        fs.unlinkSync(data.agencyVideo);
      }
      
      return res.status(401).json({ 
        success: false, 
        message: "Failed to add new agency" 
      });
    }
    
    if (agency) {
      return res.status(201).json({ 
        success: true, 
        message: "New Agency Added", 
        data: agency 
      });
    }
  } catch (error) {
    // Clean up uploaded files if error occurred
    if (req.files) {
      if (req.files.agencyLogo) {
        fs.unlinkSync(req.files.agencyLogo[0].path);
      }
      if (req.files.agencyVideo) {
        fs.unlinkSync(req.files.agencyVideo[0].path);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL APPROVED AGENCIES
const getAgenciesController = async (req, res) => {
  try {
    const query = req.query || {};
    if (query.agencyName) {
      query.agencyName = { $regex: query.agencyName, $options: "i" };
    }

    const agencies = await Agency.find(query).select("-password");
    if (!agencies) {
      return res
        .status(404)
        .json({ success: false, message: "No Agencies Found" });
    }

    res.status(200).json({ success: true, data: agencies });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE AGENCY BY ID
const getSingleAgency = async (req, res) => {
  try {
    const id = req.params.id;
    const agents = await Agent.find({ agency: id });
    const agency = await Agency.findById(id).select("-password");
    const properties = await Property.find({agency: id, status: "available"}) || [];
    if (!agency) {
      res
        .status(404)
        .json({ success: false, message: "Agency does not exist" });
    }

    res.json({
      message: "Agency Found",
      success: true,
      data: { agency, agents: [...agents], properties: [...properties] },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET AGENCY OF A USER
const getUserAgency = async (req, res) => {
  try {
    const user = req.user;
    const agency = await Agency.findById(user.agency).select("-password");

    if (!agency) {
      res
        .status(404)
        .json({ success: false, message: "No Agency Assigned to User." });
    }
    res
      .status(200)
      .json({ success: true, message: "User Found", data: agency });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE AGENCY
const updateAgency = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const user = req.user;

    // Handle file paths if files were uploaded
    if (req.files) {
      // Process logo file
      if (req.files.agencyLogo) {
        const logoFile = req.files.agencyLogo[0];
        const agencyName = data.agencyName ? data.agencyName.replace(/\s+/g, '-') : 'agency';
        const logoExtension = path.extname(logoFile.originalname);
        const logoFilename = `${agencyName}-logo-${Date.now()}${logoExtension}`;
        const logoPath = `uploads/agency/logo/${logoFilename}`;
        
        // Move file to correct location with new name
        fs.renameSync(logoFile.path, logoPath);
        data.agencyLogo = logoPath;

        // Delete old logo file if it exists
        const existingAgency = await Agency.findById(id);
        if (existingAgency.agencyLogo && fs.existsSync(existingAgency.agencyLogo)) {
          fs.unlinkSync(existingAgency.agencyLogo);
        }
      }

      // Process video file
      if (req.files.agencyVideo) {
        const videoFile = req.files.agencyVideo[0];
        const agencyName = data.agencyName ? data.agencyName.replace(/\s+/g, '-') : 'agency';
        const videoExtension = path.extname(videoFile.originalname);
        const videoFilename = `${agencyName}-video-${Date.now()}${videoExtension}`;
        const videoPath = `uploads/agency/video/${videoFilename}`;
        
        // Move file to correct location with new name
        fs.renameSync(videoFile.path, videoPath);
        data.agencyVideo = videoPath;

        // Delete old video file if it exists
        const existingAgency = await Agency.findById(id);
        if (existingAgency.agencyVideo && fs.existsSync(existingAgency.agencyVideo)) {
          fs.unlinkSync(existingAgency.agencyVideo);
        }
      }
    }

    // CHECK IF THE USER IS NOT ADMIN TRYING TO PERFORM ADMIN ACTION
    if (
      "status" in data ||
      "classifiedAds" in data ||
      "videoAds" in data ||
      "featuredAds" in data
    ) {
      if (user.role !== "admin") {
        return res
          .status(401)
          .json({ success: false, message: "Action reserved for Admin only." });
      }
    }

    // CHECK IF THE USER IS ADMIN TRYING TO PERFORM NON_ADMIN ACTIONS
    if (
      "agencyName" in data ||
      "agencyEmail" in data ||
      "password" in data ||
      "ceoName" in data ||
      "ceoPhone" in data ||
      "whatsapp" in data ||
      "city" in data ||
      "phase" in data ||
      "address" in data ||
      "facebook" in data ||
      "youtube" in data ||
      "twitter" in data ||
      "instagram" in data ||
      "agencyLogo" in data ||
      "agencyVideo" in data ||
      "about" in data ||
      "website" in data
    ) {
      if (user.role == "admin") {
        return res.status(401).json({
          success: false,
          message: "Admin Cannot perform these actions",
        });
      }
    }

    // CHECK IF THE USER IS TRYING TO UPDATE PASSWORD
    if ("password" in data) {
      return res
        .status(401)
        .json({ success: false, message: "Action Forbidden" });
    }

    const agency = await Agency.findById(id);

    if ("status" in data && agency.status === data.status) {
      delete data.status;
    }

    if ("status" in data && data.status !== "Approved") {
      const user = await User.findOne({ agency: id });
      if (user) {
        await user.deleteOne();
      }
    }

    const updatedAgency = await Agency.findByIdAndUpdate(id, data, { new: true });
    
    if (updatedAgency && data.status === "Approved") {
      const user = await User.create({
        name: updatedAgency.ceoName,
        role: "agency",
        email: updatedAgency.agencyEmail,
        password: updatedAgency.password,
        agency: updatedAgency._id,
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Agency Admin User could not be created",
        });
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Agency Updated.",
      data: updatedAgency 
    });
    
  } catch (error) {
    // Clean up uploaded files if error occurred
    if (req.files) {
      if (req.files.agencyLogo) {
        fs.unlinkSync(req.files.agencyLogo[0].path);
      }
      if (req.files.agencyVideo) {
        fs.unlinkSync(req.files.agencyVideo[0].path);
      }
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addAgencyController,
  getAgenciesController,
  getSingleAgency,
  updateAgency,
  getUserAgency,
};
