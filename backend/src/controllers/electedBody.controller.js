const { ElectedBody } = require("../models/electedBody.model");

const ensureAdmin = (user) => {
  if (!user || user.role !== "admin") {
    const error = new Error("Only admins are allowed to perform this action");
    error.statusCode = 403;
    throw error;
  }
};

const createElectedBodyMember = async (req, res) => {
  try {
    ensureAdmin(req.user);
    const payload = req.body;

    // Handle file upload
    if (req.file) {
      payload.photo = req.file.path;
    } else {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required"
      });
    }

    const member = await ElectedBody.create(payload);

    res.status(201).json({
      success: true,
      message: "Elected body member created successfully",
      data: member,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const getElectedBodyMembers = async (req, res) => {
  try {
    const { status, isActive, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (typeof isActive !== "undefined") {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
        { agencyBelong: { $regex: search, $options: "i" } },
      ];
    }

    const members = await ElectedBody.find(filter).sort({
      status: -1,
      createdAt: -1,
    });

    // Return file paths directly - frontend will convert to URLs
    res
      .status(200)
      .json({ success: true, message: "Members fetched", data: members });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getElectedBodyMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await ElectedBody.findById(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Member fetched",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateElectedBodyMember = async (req, res) => {
  try {
    ensureAdmin(req.user);
    const { id } = req.params;
    const payload = req.body;

    // Handle file upload if a new photo is provided
    if (req.file) {
      payload.photo = req.file.path;
    }

    const member = await ElectedBody.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteElectedBodyMember = async (req, res) => {
  try {
    ensureAdmin(req.user);
    const { id } = req.params;

    const member = await ElectedBody.findByIdAndDelete(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createElectedBodyMember,
  getElectedBodyMembers,
  getElectedBodyMemberById,
  updateElectedBodyMember,
  deleteElectedBodyMember,
};