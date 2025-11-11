const { Agency } = require("../models/agency.model");
const { Agent } = require("../models/agent.model");
const { Property } = require("../models/property.model");

const createPropertyController = async (req, res) => {
  try {
    let agent = req.agent;

    const body = req.body;
    const adType = body.adType;
    const agency = await Agency.findById(agent.agency);
    agent = await Agent.findById(agent._id);

    if (adType !== "none" && agency[adType] === 0) {
      return res.status(400).json({
        success: false,
        message: `Action Failed: You have used all of your ${adType}`,
      });
    }

    if (adType !== "none") {
      body.status = "pending";
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
        
        await agency.save();
      }

      if(agent[adType] === 0){
        return
      }else{
        agent[adType] = agent[adType] - 1; 
        await agent.save();
      }
    }

    if (!property) {
      return res
        .status(400)
        .json({ success: false, message: "Property Could not be added" });
    }

    if (adType !== "none") {
      res.status(201).json({
        success: true,
        data: property,
        message: "Admin will approve your Listing in 24 hours.",
      });
    } else {
      res.status(201).json({
        success: true,
        data: property,
        message: "Property has been added.",
      });
    }
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
      agent,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const query = req.query;

    if (query.title) {
      query.title = { $regex: query.title, $options: "i" };
    }

    const properties = await Property.find({ ...query });
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
      return res.status(403).json({
        success: false,
        message: "User tried to change sensitive data",
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property Not Found" });
    }

    if (agent._id.toString() !== property.agent.toString()) {
      return res.status(403).json({ success: false, message: "Action Forbidden" });
    }

    const oldAdType = property.adType;
    const newAdType = body.adType;

    // Get current agency and agent
    const agency = await Agency.findById(property.agency);
    const currentAgent = await Agent.findById(property.agent);

    if (!agency || !currentAgent) {
      return res.status(404).json({ success: false, message: "Agency or Agent not found" });
    }

    // Handle ad type changes
    if (oldAdType !== newAdType) {
      // If changing FROM a paid ad type TO "none"
      if (oldAdType !== "none" && newAdType === "none") {
        // Return the ad count to agency and agent
        agency[oldAdType] += 1;
        currentAgent[oldAdType] += 1;
        
        // Change status to available
        body.status = "available";
      }
      // If changing FROM "none" TO a paid ad type
      else if (oldAdType === "none" && newAdType !== "none") {
        // Check if agency and agent have enough ads
        if (agency[newAdType] <= 0) {
          return res.status(400).json({
            success: false,
            message: `Agency doesn't have enough ${newAdType} available`
          });
        }
        if (currentAgent[newAdType] <= 0) {
          return res.status(400).json({
            success: false,
            message: `You don't have enough ${newAdType} available`
          });
        }

        // Deduct from agency and agent
        agency[newAdType] -= 1;
        currentAgent[newAdType] -= 1;
        
        // Change status to pending
        body.status = "pending";
      }
      // If changing BETWEEN paid ad types
      else if (oldAdType !== "none" && newAdType !== "none") {
        // Return the old ad type
        agency[oldAdType] += 1;
        currentAgent[oldAdType] += 1;

        // Check if agency and agent have enough of the new ad type
        if (agency[newAdType] <= 0) {
          return res.status(400).json({
            success: false,
            message: `Agency doesn't have enough ${newAdType} available`
          });
        }
        if (currentAgent[newAdType] <= 0) {
          return res.status(400).json({
            success: false,
            message: `You don't have enough ${newAdType} available`
          });
        }

        // Deduct the new ad type
        agency[newAdType] -= 1;
        currentAgent[newAdType] -= 1;
        
        // Keep status as pending
        body.status = "pending";
      }
    }

    // Prevent agents from directly updating status (only agency/admin can do this)
    if (body.status && body.status !== property.status) {
      // If agent is trying to change status and it's not due to ad type change
      if (!(oldAdType !== newAdType && 
          ((oldAdType === "none" && newAdType !== "none") || 
           (oldAdType !== "none" && newAdType === "none")))) {
        delete body.status; // Remove status from update if agent tries to change it directly
      }
    }

    // Update the property
    Object.assign(property, body);
    await property.save();

    // Save agency and agent if their ad counts changed
    if (oldAdType !== newAdType) {
      await agency.save();
      await currentAgent.save();
    }

    res.status(200).json({ 
      success: true, 
      data: property,
      message: oldAdType !== newAdType ? 
        `Ad type updated from ${oldAdType} to ${newAdType}. Status: ${body.status}` :
        "Property updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updatePropertyStatusController = async (req, res) => {
  try {
    const user = req.user; // From protect middleware
    const id = req.params.id;
    const { status } = req.body;

    // Only agency or admin can update status directly
    if (user.role !== "agency" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only agency or admin can update property status directly"
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property Not Found" });
    }

    // Agency can only update their own properties
    if (user.role === "agency" && property.agency.toString() !== user.agency.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update properties from your own agency"
      });
    }

    property.status = status;
    await property.save();

    res.status(200).json({ 
      success: true, 
      data: property,
      message: `Property status updated to ${status}`
    });

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

const getAgencyProperties = async (req, res) => {
  try {
    const user = req.user;
    const query = req.query || {};
    
    // Check if user has an agency associated
    if (!user.agency) {
      return res.status(400).json({
        success: false,
        message: "User is not associated with any agency"
      });
    }

    // Build filter object
    const filter = { agency: user.agency };

    // Add search by title if provided
    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    // Add filter by category if provided
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    // Add filter by type if provided
    if (query.type && query.type !== 'All') {
      filter.type = query.type;
    }

    // Add filter by status if provided
    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    // Add filter by agent if provided
    if (query.agent && query.agent !== 'All') {
      filter.agent = query.agent;
    }

    const properties = await Property.find(filter)
      .populate('agent')
      .sort({ createdAt: -1 });

    if (!properties || properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No properties found for this agency"
      });
    }

    res.status(200).json({
      success: true,
      data: properties,
      count: properties.length
    });

  } catch (error) {
    console.error("Error fetching agency properties:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching properties"
    });
  }
}

module.exports = {
  createPropertyController,
  getSinglePropertyComtroller,
  getAllProperties,
  updatePropertyController,
  deletePropertyController,
  getAgentPropertiesController,
  updatePropertyStatusController,
  getAgencyProperties
};
