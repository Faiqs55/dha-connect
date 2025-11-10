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

    // Create property data object with proper field mapping
    const propertyData = {
      ...body,
      agency: agent.agency,
      agent: agent._id,
      // Ensure proper field names match schema
      category: body.category,
      type: body.type,
      subType: body.subType,
      area: body.area,
      areaUnit: body.areaUnit,
      price: body.price,
      phase: body.phase,
      address: body.address,
      plotNumber: body.plotNumber,
      description: body.description,
      images: body.images,
      thumbnailImage: body.thumbnailImage,
      video: body.video,
      adType: body.adType,
      // Handle conditional fields
      ...(body.bedrooms && { bedrooms: body.bedrooms }),
      ...(body.bathrooms && { bathrooms: body.bathrooms }),
      ...(body.otherFeatures && { otherFeatures: body.otherFeatures }),
      ...(body.plotAmenities && { plotAmenities: body.plotAmenities }),
      ...(body.plotFileType && { plotFileType: body.plotFileType }),
      // Add payment plan for Rent category
      ...(body.category === "Rent" && body.paymentPlan && { paymentPlan: body.paymentPlan }),
      // Set expiration (will be set to 30 days by model default)
      expiresAt: body.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isPermanent: body.isPermanent || false
    };

    const property = await Property.create(propertyData);

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
        message: "Property has been added. It will auto-delete after 30 days.",
      });
    }
  } catch (error) {
    console.error("Create Property Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSinglePropertyController = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ success: false, message: "Property Not Found" });
    }

    const agency = await Agency.findById(property.agency);
    const agent = await Agent.findById(property.agent);

    const data = {
      ...property._doc,
      agency,
      agent,
      // Include virtual fields
      daysRemaining: property.daysRemaining
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Get Single Property Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const query = req.query;

    // Build filter object
    const filter = {};

    // Add search by title if provided
    if (query.title) {
      filter.title = { $regex: query.title, $options: "i" };
    }

    // Add filters for other fields
    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    if (query.type && query.type !== 'All') {
      filter.type = query.type;
    }

    if (query.subType && query.subType !== 'All') {
      filter.subType = query.subType;
    }

    if (query.phase && query.phase !== 'All') {
      filter.phase = query.phase;
    }

    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    if (query.adType && query.adType !== 'All') {
      filter.adType = query.adType;
    }

    // Filter by permanent status
    if (query.isPermanent && query.isPermanent !== 'All') {
      filter.isPermanent = query.isPermanent === 'true';
    }

    // Price range filter
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = query.minPrice;
      if (query.maxPrice) filter.price.$lte = query.maxPrice;
    }

    // Filter by expiration status
    if (query.expired === 'true') {
      filter.expiresAt = { $lt: new Date() };
    } else if (query.expired === 'false') {
      filter.expiresAt = { $gte: new Date() };
    }

    const properties = await Property.find(filter)
      .populate('agent').select("-password")
      .populate('agency').select("-password")
      .sort({ createdAt: -1 });

    // Sort properties by adType in the specified order
    const sortedProperties = properties.sort((a, b) => {
      // Define the priority order for adTypes
      const adTypePriority = {
        'featuredAds': 1,    // Highest priority
        'videoAds': 2,       // Second priority
        'classifiedAds': 3,   // Third priority
        'none': 4            // Lowest priority
      };

      // Get the priority for each property's adType
      const priorityA = adTypePriority[a.adType] || 5; // Default to 5 if adType not found
      const priorityB = adTypePriority[b.adType] || 5; // Default to 5 if adType not found

      // If same priority, maintain the original order (by createdAt descending)
      if (priorityA === priorityB) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      // Sort by priority (lower number = higher priority)
      return priorityA - priorityB;
    });

    // Add virtual fields to response
    const propertiesWithExpiration = sortedProperties.map(property => ({
      ...property._doc,
      daysRemaining: property.daysRemaining
    }));

    res.status(200).json({ 
      success: true, 
      data: propertiesWithExpiration,
      count: propertiesWithExpiration.length 
    });
  } catch (error) {
    console.error("Get All Properties Error:", error);
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
    
    // Build filter object
    const filter = { agent: agent._id };

    if (query.title) {
      filter.title = { $regex: query.title, $options: "i" };
    }

    if (query.category && query.category !== 'All') {
      filter.category = query.category;
    }

    if (query.type && query.type !== 'All') {
      filter.type = query.type;
    }

    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    // Filter by expiration status
    if (query.expired === 'true') {
      filter.expiresAt = { $lt: new Date() };
    } else if (query.expired === 'false') {
      filter.expiresAt = { $gte: new Date() };
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    if (!properties) {
      return res
        .status(404)
        .json({ success: false, message: "Could not Find Properties" });
    }

    // Add virtual fields to response
    const propertiesWithExpiration = properties.map(property => ({
      ...property._doc,
      daysRemaining: property.daysRemaining
    }));
    
    res.status(200).json({ 
      success: true, 
      data: propertiesWithExpiration,
      count: properties.length 
    });
  } catch (error) {
    console.error("Get Agent Properties Error:", error);
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

    // Prevent agents from updating expiration fields
    delete body.expiresAt;
    delete body.isPermanent;

    // Update the property with new schema fields
    const updateData = {
      ...body,
      // Ensure proper field mapping for new schema
      ...(body.type && { type: body.type }),
      ...(body.subType && { subType: body.subType }),
      ...(body.areaUnit && { areaUnit: body.areaUnit }),
      ...(body.plotAmenities !== undefined && { plotAmenities: body.plotAmenities }),
      ...(body.plotFileType !== undefined && { plotFileType: body.plotFileType }),
      ...(body.otherFeatures !== undefined && { otherFeatures: body.otherFeatures }),
      ...(body.plotNumber !== undefined && { plotNumber: body.plotNumber }),
      ...(body.category === "Rent" && body.paymentPlan && { paymentPlan: body.paymentPlan })
    };

    Object.assign(property, updateData);
    await property.save();

    // Save agency and agent if their ad counts changed
    if (oldAdType !== newAdType) {
      await agency.save();
      await currentAgent.save();
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...property._doc,
        daysRemaining: property.daysRemaining
      },
      message: oldAdType !== newAdType ? 
        `Ad type updated from ${oldAdType} to ${newAdType}. Status: ${body.status}` :
        "Property updated successfully"
    });

  } catch (error) {
    console.error("Update Property Error:", error);
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
      data: {
        ...property._doc,
        daysRemaining: property.daysRemaining
      },
      message: `Property status updated to ${status}`
    });

  } catch (error) {
    console.error("Update Property Status Error:", error);
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

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (!agent && user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only agents or agencies can delete Properties",
      });
    }

    // Check ownership
    if (user.role === "agency" && property.agency.toString() !== user.agency.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete properties from your own agency",
      });
    }

    if (agent && property.agent.toString() !== agent._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own properties",
      });
    }

    // Return ad count if property had a paid ad type
    if (property.adType !== "none") {
      const agency = await Agency.findById(property.agency);
      const propertyAgent = await Agent.findById(property.agent);
      
      if (agency && propertyAgent) {
        agency[property.adType] += 1;
        propertyAgent[property.adType] += 1;
        
        await agency.save();
        await propertyAgent.save();
      }
    }

    await Property.findByIdAndDelete(id);
    
    res.status(200).json({ 
      success: true, 
      data: { message: "Property has been deleted" } 
    });
  } catch (error) {
    console.error("Delete Property Error:", error);
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

    // Add filter by subType if provided
    if (query.subType && query.subType !== 'All') {
      filter.subType = query.subType;
    }

    // Add filter by status if provided
    if (query.status && query.status !== 'All') {
      filter.status = query.status;
    }

    // Add filter by agent if provided
    if (query.agent && query.agent !== 'All') {
      filter.agent = query.agent;
    }

    // Add filter by phase if provided
    if (query.phase && query.phase !== 'All') {
      filter.phase = query.phase;
    }

    // Add filter by adType if provided
    if (query.adType && query.adType !== 'All') {
      filter.adType = query.adType;
    }

    // Filter by permanent status
    if (query.isPermanent && query.isPermanent !== 'All') {
      filter.isPermanent = query.isPermanent === 'true';
    }

    // Filter by expiration status
    if (query.expired === 'true') {
      filter.expiresAt = { $lt: new Date() };
    } else if (query.expired === 'false') {
      filter.expiresAt = { $gte: new Date() };
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

    // Add virtual fields to response
    const propertiesWithExpiration = properties.map(property => ({
      ...property._doc,
      daysRemaining: property.daysRemaining
    }));

    res.status(200).json({
      success: true,
      data: propertiesWithExpiration,
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

// New controller to extend property expiration
const extendPropertyExpirationController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const { days = 30 } = req.body;

    // Only agency or admin can extend expiration
    if (user.role !== "agency" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only agency or admin can extend property expiration"
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property Not Found" });
    }

    // Agency can only extend their own properties
    if (user.role === "agency" && property.agency.toString() !== user.agency.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only extend expiration for properties from your own agency"
      });
    }

    const updatedProperty = await Property.extendExpiration(id, days);

    res.status(200).json({
      success: true,
      data: {
        ...updatedProperty._doc,
        daysRemaining: updatedProperty.daysRemaining
      },
      message: `Property expiration extended by ${days} days`
    });
  } catch (error) {
    console.error("Extend Property Expiration Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// New controller to make property permanent
const makePropertyPermanentController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    // Only agency or admin can make properties permanent
    if (user.role !== "agency" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only agency or admin can make properties permanent"
      });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property Not Found" });
    }

    // Agency can only make their own properties permanent
    if (user.role === "agency" && property.agency.toString() !== user.agency.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only make properties from your own agency permanent"
      });
    }

    const updatedProperty = await Property.makePermanent(id);

    res.status(200).json({
      success: true,
      data: {
        ...updatedProperty._doc,
        daysRemaining: updatedProperty.daysRemaining
      },
      message: "Property is now permanent and will not auto-delete"
    });
  } catch (error) {
    console.error("Make Property Permanent Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// New controller to get expired properties
const getExpiredPropertiesController = async (req, res) => {
  try {
    const user = req.user;
    
    // Only agency or admin can view expired properties
    if (user.role !== "agency" && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only agency or admin can view expired properties"
      });
    }

    let filter = { expiresAt: { $lt: new Date() } };

    // Agency can only view their own expired properties
    if (user.role === "agency") {
      filter.agency = user.agency;
    }

    const expiredProperties = await Property.find(filter)
      .populate('agent')
      .populate('agency')
      .sort({ expiresAt: -1 });

    res.status(200).json({
      success: true,
      data: expiredProperties,
      count: expiredProperties.length,
      message: `Found ${expiredProperties.length} expired properties`
    });
  } catch (error) {
    console.error("Get Expired Properties Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPropertyController,
  getSinglePropertyController,
  getAllProperties,
  updatePropertyController,
  deletePropertyController,
  getAgentPropertiesController,
  updatePropertyStatusController,
  getAgencyProperties,
  extendPropertyExpirationController,
  makePropertyPermanentController,
  getExpiredPropertiesController
};