const Phase = require("../models/phaseModel");
const PhaseName = require("../models/phaseNameModel");
const axios = require("axios");

// Helper function for PKR to USD conversion
async function convertPKRtoUSD(amount) {
  try {
    const response = await axios.get(
      "https://api.exchangerate.host/convert?from=PKR&to=USD"
    );
    const usdRate = response.data.info.rate;
    return amount * usdRate;
  } catch (err) {
    console.error("Live conversion failed, using static fallback:", err.message);
    // Fallback to static rate: 280 PKR = 1 USD
    return amount / 280;
  }
}

function normalizePhaseResponse(phase) {
  if (!phase) return null;

  const plain =
    typeof phase.toObject === "function"
      ? phase.toObject({ virtuals: false })
      : { ...phase };

  if (plain._id && typeof plain._id.toString === "function") {
    plain._id = plain._id.toString();
  }

  const phaseNameData = plain.phaseName;

  if (phaseNameData && typeof phaseNameData === "object" && phaseNameData.name) {
    plain.phaseNameId = phaseNameData._id ? phaseNameData._id.toString() : undefined;
    plain.phaseName = phaseNameData.name;
    plain.phaseNameDetails = {
      _id: phaseNameData._id ? phaseNameData._id.toString() : undefined,
      name: phaseNameData.name,
      isActive: phaseNameData.isActive,
    };
  } else if (phaseNameData) {
    const phaseNameId =
      typeof phaseNameData === "string"
        ? phaseNameData
        : phaseNameData.toString ? phaseNameData.toString() : phaseNameData;
    plain.phaseNameId = phaseNameId;
  }

  if (!plain.phaseNameDetails) {
    delete plain.phaseNameDetails;
  }

  delete plain.__v;

  return plain;
}

// CREATE PHASE
const createPhase = async (req, res) => {
  try {
    // Check if user is authenticated and has admin or agency role
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Debug log to check user role
    console.log("Creating phase - User role:", user.role, "User email:", user.email);

    // Allow both admin and agency roles
    if (user.role !== "admin" && user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only admin or agency can perform this action",
      });
    }

    const {
      phaseName,
      description,
      ratePKR,
      rate,
      lastUpdated,
      status,
      isPublished,
      categoryType,
      propertyType,
    } = req.body;

    // Validate required fields
    if (!phaseName || !description || (!ratePKR && !rate) || !lastUpdated) {
      return res.status(400).json({
        success: false,
        message: "Phase name, description, PKR rate, and lastUpdated are required",
      });
    }

    // Validate phase name exists
    const phaseNameRecord = await PhaseName.findById(phaseName);
    if (!phaseNameRecord || phaseNameRecord.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive phase name provided",
      });
    }

    // Validate rate is a number (PKR input)
    const rateInput = ratePKR ?? rate;
    const rateNumber = parseFloat(rateInput);
    if (isNaN(rateNumber) || rateNumber < 0) {
      return res.status(400).json({
        success: false,
        message: "PKR rate must be a valid positive number",
      });
    }

    // Calculate USD conversion from PKR
    const usdRate = await convertPKRtoUSD(rateNumber);
    const roundedUsdRate = Number.parseFloat((usdRate ?? 0).toFixed(2));

    // Validate and parse lastUpdated date
    const lastUpdatedDate = new Date(lastUpdated);
    if (isNaN(lastUpdatedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid lastUpdated date format",
      });
    }

    // Create new phase
    const phase = await Phase.create({
      phaseName: phaseNameRecord._id,
      categoryType: categoryType || "Allocation",
      propertyType: propertyType || "Residential",
      description: description.trim(),
      ratePKR: rateNumber,
      rateUSD: roundedUsdRate,
      currencyType: "BOTH",
      lastUpdated: lastUpdatedDate,
      status: status || "new",
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    const populatedPhase = await phase.populate({
      path: "phaseName",
      select: "name isActive",
    });

    res.status(201).json({
      success: true,
      message: "Phase created successfully",
      data: normalizePhaseResponse(populatedPhase),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PHASES (PUBLIC API - No authentication required)
const getPhases = async (req, res) => {
  try {
    const {
      phaseName,
      status,
      isPublished,
      description,
      currencyType,
      categoryType,
      propertyType,
      page = 1,
      limit = 100,
      sortBy = "lastUpdated",
      sortOrder = "desc",
    } = req.query;
    
    // Build query object
    const query = {};
    
    // Filter by phaseName
    if (phaseName) {
      query.phaseName = phaseName;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by isPublished (default to true for public API)
    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true" || isPublished === true;
    } else {
      // Default: only show published phases for public access
      query.isPublished = true;
    }
    
    // Filter by description (partial match)
    if (description) {
      query.description = { $regex: description.trim(), $options: "i" };
    }
    
    // Filter by currencyType
    if (currencyType) {
      query.currencyType = currencyType.toUpperCase();
    }

    if (categoryType) {
      query.categoryType = categoryType;
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Sort options
    const sortOptions = {};
    const sortField = sortBy || "lastUpdated";
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    sortOptions[sortField] = sortDirection;
    
    // Execute query with pagination
    const phases = await Phase.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate({ path: "phaseName", select: "name isActive" })
      .select("-__v")
      .lean();

    const normalizedPhases = phases.map((phase) => normalizePhaseResponse(phase));
    
    // Get total count for pagination info
    const totalCount = await Phase.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.status(200).json({
      success: true,
      message: "Phases retrieved successfully",
      count: normalizedPhases.length,
      totalCount,
      currentPage: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: normalizedPhases,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PHASE BY ID (PUBLIC API - No authentication required)
const getPhaseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Phase ID is required",
      });
    }

    // For public access, only return published phases
    const phase = await Phase.findOne({ 
      _id: id,
      isPublished: true 
    })
      .populate({ path: "phaseName", select: "name isActive" })
      .select("-__v");

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found or not published",
      });
    }

    res.status(200).json({
      success: true,
      message: "Phase retrieved successfully",
      data: normalizePhaseResponse(phase),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PHASE
const updatePhase = async (req, res) => {
  try {
    // Check if user is authenticated and has admin or agency role
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (user.role !== "admin" && user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only admin or agency can perform this action",
      });
    }

    const { id } = req.params;
    const {
      phaseName,
      description,
      ratePKR,
      rate,
      lastUpdated,
      status,
      isPublished,
      categoryType,
      propertyType,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Phase ID is required",
      });
    }

    const phase = await Phase.findById(id);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    // Prepare update object
    const updateData = {};

    if (phaseName) {
      const phaseNameRecord = await PhaseName.findById(phaseName);
      if (!phaseNameRecord || phaseNameRecord.isActive === false) {
        return res.status(400).json({
          success: false,
          message: "Invalid or inactive phase name provided",
        });
      }
      updateData.phaseName = phaseNameRecord._id;
    }

    if (categoryType) updateData.categoryType = categoryType;
    if (propertyType) updateData.propertyType = propertyType;
    if (description) updateData.description = description.trim();
    if (lastUpdated) {
      const lastUpdatedDate = new Date(lastUpdated);
      if (isNaN(lastUpdatedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid lastUpdated date format",
        });
      }
      updateData.lastUpdated = lastUpdatedDate;
    }
    if (status) updateData.status = status;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    // Handle rate and currency conversion
    const rateInput = ratePKR ?? rate;
    if (rateInput !== undefined) {
      const rateNumber = parseFloat(rateInput);
      if (isNaN(rateNumber) || rateNumber < 0) {
        return res.status(400).json({
          success: false,
          message: "PKR rate must be a valid positive number",
        });
      }

      const usdRate = await convertPKRtoUSD(rateNumber);
      updateData.ratePKR = rateNumber;
      updateData.rateUSD = Number.parseFloat((usdRate ?? 0).toFixed(2));
      updateData.currencyType = "BOTH";
    }

    // Update phase
    const updatedPhase = await Phase.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate({ path: "phaseName", select: "name isActive" });

    res.status(200).json({
      success: true,
      message: "Phase updated successfully",
      data: normalizePhaseResponse(updatedPhase),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PHASE
const deletePhase = async (req, res) => {
  try {
    // Check if user is authenticated and has admin or agency role
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (user.role !== "admin" && user.role !== "agency") {
      return res.status(403).json({
        success: false,
        message: "Only admin or agency can perform this action",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Phase ID is required",
      });
    }

    const phase = await Phase.findById(id);

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: "Phase not found",
      });
    }

    await Phase.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Phase deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPhase,
  getPhases,
  getPhaseById,
  updatePhase,
  deletePhase,
};

