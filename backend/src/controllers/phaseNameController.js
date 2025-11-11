const PhaseName = require("../models/phaseNameModel");
const Phase = require("../models/phaseModel");

const ensureAdminOrAgency = (user) => {
  if (!user) {
    return { status: 401, message: "Authentication required" };
  }

  if (user.role !== "admin" && user.role !== "agency") {
    return { status: 403, message: "Only admin or agency can perform this action" };
  }

  return null;
};

const createPhaseName = async (req, res) => {
  try {
    const { user } = req;
    const authError = ensureAdminOrAgency(user);
    if (authError) {
      return res.status(authError.status).json({ success: false, message: authError.message });
    }

    const { name, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phase name is required",
      });
    }

    const existing = await PhaseName.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Phase name already exists",
      });
    }

    const payload = { name: name.trim() };

    if (typeof isActive === "boolean") {
      payload.isActive = isActive;
    }

    const phaseName = await PhaseName.create(payload);

    res.status(201).json({
      success: true,
      message: "Phase name created successfully",
      data: phaseName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPhaseNames = async (req, res) => {
  try {
    const { includeInactive } = req.query;

    const query = {};
    if (!includeInactive || includeInactive === "false") {
      query.isActive = true;
    }

    const phaseNames = await PhaseName.find(query).sort({ name: 1 }).lean();

    res.status(200).json({
      success: true,
      message: "Phase names retrieved successfully",
      data: phaseNames.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePhaseName = async (req, res) => {
  try {
    const { user } = req;
    const authError = ensureAdminOrAgency(user);
    if (authError) {
      return res.status(authError.status).json({ success: false, message: authError.message });
    }

    const { id } = req.params;
    const { name, isActive } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Phase name ID is required",
      });
    }

    const updateData = {};

    if (name) {
      const trimmed = name.trim();
      if (!trimmed) {
        return res.status(400).json({
          success: false,
          message: "Phase name cannot be empty",
        });
      }

      const duplicate = await PhaseName.findOne({
        _id: { $ne: id },
        name: trimmed,
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: "Another phase name with this value already exists",
        });
      }

      updateData.name = trimmed;
    }

    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedPhaseName = await PhaseName.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPhaseName) {
      return res.status(404).json({
        success: false,
        message: "Phase name not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Phase name updated successfully",
      data: updatedPhaseName,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePhaseName = async (req, res) => {
  try {
    const { user } = req;
    const authError = ensureAdminOrAgency(user);
    if (authError) {
      return res.status(authError.status).json({ success: false, message: authError.message });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Phase name ID is required",
      });
    }

    const phaseName = await PhaseName.findById(id);

    if (!phaseName) {
      return res.status(404).json({
        success: false,
        message: "Phase name not found",
      });
    }

    const isReferenced = await Phase.exists({ phaseName: id });

    if (isReferenced) {
      await PhaseName.findByIdAndUpdate(id, { isActive: false });
      return res.status(200).json({
        success: true,
        message: "Phase name is in use and has been deactivated instead of deleted",
      });
    }

    await PhaseName.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Phase name deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPhaseName,
  getPhaseNames,
  updatePhaseName,
  deletePhaseName,
};


