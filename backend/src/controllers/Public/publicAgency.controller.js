const { Agency } = require("../../models/agency.model");

const getAgenciesController = async (req, res) => {
  try {
    const agencies = await Agency.find();
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

module.exports = {
    getAgenciesController
}
