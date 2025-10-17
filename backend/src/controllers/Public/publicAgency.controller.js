const { Agency } = require("../../models/agency.model");

const getAgenciesController = async (req, res) => {
  try {
    const agencies = await Agency.find().select("-password");
    if (!agencies || agencies.length < 1) {
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

const getSingleAgency = async (req, res) => {
  try {
    const id = req.params.id;
    const agency = await Agency.findById(id).select("-password");
    if (!agency) {
      res
        .status(404)
        .json({ success: false, message: "Agency does not exist" });
    }
    res.json({ message: "Agency Found", success: true, data: agency });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAgenciesController,
  getSingleAgency,
};
