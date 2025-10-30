const { Agency } = require("../models/agency.model");
const { Agent } = require("../models/agent.model");
const { Property } = require("../models/property.model");

const createPropertyController = async (req, res) => {
  try {
    const agent = req.agent;

    const body = req.body;
    const adType = body.adType;
    const agency = await Agency.findById(agent.agency);

    if (adType !== "none" && agency[adType] === 0) {
      return res.status(400).json({
        success: false,
        message: `Action Failed: You have used all of your ${adType}`,
      });
    }
    const property = await Property.create({
      ...body,
      agency: agent.agency,
      agent: agent._id,
    });

    if (body.adType !== "none") {
      if (agency[adType] === 0) {
        return;
      } else {
        agency[adType] = agency[adType] - 1;
        agency.save();
      }
    }

    if (!property) {
      return res
        .status(400)
        .json({ success: false, message: "Property Could not be added" });
    }

    res
      .status(201)
      .json({
        success: true,
        data: property,
        message: "Property has been added.",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSinglePropertyComtroller = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: "Property Not Found" });
    }

    const agency = await Agency.findById(property.agency);
    const agent = await Agent.findById(property.agent);

    const data = {
      ...property._doc,
      agency,
      agent
    }

    res
      .status(200)
      .json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAgentPropertiesController = async (req, res) => {
  try {
    const agent = req.agent;
    const query = req.query;
    if (query.title) {
      query.title = { $regex: query.title, $options: "i" };
    }

    const properties = await Property.find({ agent: agent._id, ...query });

    if (!properties) {
      return res
        .status(404)
        .json({ success: false, message: "Could not Find Properties" });
    }
    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePropertyController = async (req, res) => {
  try {
    const agent = req.agent;
    const id = req.params.id;
    const body = req.body;

    if ("agency" in body || "agent" in body) {
      res.status(403).json({
        success: false,
        message: "User tried to change sensitive data",
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ success: false, message: "Property Not Found" });
    }

    if (agent._id !== property.agent) {
      res.status(403).json({ success: false, message: "Action Forbidden" });
    }

    Object.assign(property, body);
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePropertyController = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const agent = req.agent;

    const property = await Property.findById(id);

    if (!agent && user.role !== "agency") {
      res.status(403).json({
        success: false,
        message: "Only agents or agencies can delete Properties",
      });
    }

    if (property.agency !== user.agency && property.agent !== agent._id) {
      res.status(403).json({
        success: false,
        message: "You can only Delete your own agency",
      });
    }

    await property.deleteOne();
    res
      .status(200)
      .json({ success: true, data: { message: "Property has been deleted" } });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPropertyController,
  getSinglePropertyComtroller,
  getAllProperties,
  updatePropertyController,
  deletePropertyController,
  getAgentPropertiesController,
};
