const { Staff } = require("../models/staff.model");

// ADD NEW STAFF MEMBER
const addStaffController = async (req, res) => {
  try {
    const data = req.body;
    const user = req.user;
    if (user.role === "admin") {
      return res
        .status(401)
        .json({ success: false, message: "Admins cannot Manage Agency Staff" });
    }
    data.agency = user.agency;

    const staff = await Staff.create(data);

    if (!staff) {
      return res
        .status(400)
        .json({ success: false, message: "Staff Member could not be created" });
    }

    res.status(201).json({ success: true, message: "Staff member added" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE STAFF MEMBER
const getSingleStaffController = async (req, res) => {
  try {
    const id = req.params.iq;
    const staff = await Staff.findById(id);
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff member does not exist" });
    }

    res.status(200).json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL STAFF MEMBERS OF AN AGENCY
const getAllStaffController = async (req, res) => {
  try {
    const agencyId = req.params.agencyId;
    const staffMembers = await Staff.find({ agency: agencyId });

    if (staffMembers.length < 1) {
      return res
        .status(404)
        .json({ success: false, message: "This agency has no Staff Members" });
    }

    res.status(200).json({ success: true, data: staffMembers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE A STAFF MEMBER
const updateStaffController = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const data = req.body;
    if (!(user.role === "agency")) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Only Agencies can update staff members",
        });
    }

    const staff = await Staff.findById(id);

    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff Member does not Exist" });
    }

    if (staff.agency !== user.agency) {
      return res
        .status(401)
        .json({
          success: false,
          message: "You can only update your own staff member",
        });
      }
      const updatedStaff = await staff.updateOne(data);

      if(!updatedStaff){
        return res
        .status(400)
        .json({
          success: false,
          message: "Staff member was not updated",
        });
      }

      res.status(200).json({success: true, data: updatedStaff})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addStaffController,
  getAllStaffController,
  getSingleStaffController,
  updateStaffController
};
