const { Agency } = require("../../models/agency.model");

const addAgencyController = async (req, res) => {
  try {
    const data = req.body;
    const agency = await Agency.create(data);
    if (!agency) {
      return res.status(401).json({ success: false, message: "Failed to add new agency" });
    }
    if (agency) {
      return res
        .status(201)
        .json({ success: true, message: "New Agency Added", data: agency });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addAgencyController,
};
