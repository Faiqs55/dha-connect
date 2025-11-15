const express = require("express");
const {
  getAgenciesController,
  getSingleAgency,
  addAgencyController,
  updateAgency,
  getUserAgency,
} = require("../controllers/agency.controller");
const { protect } = require("../middlewares/authMiddleware");
const { agencyUpload } = require("../middlewares/uploadMiddleware");
const agencyRouter = express.Router();

agencyRouter.route("/").post(agencyUpload, addAgencyController).get(getAgenciesController);

agencyRouter.route("/singleAgency/:id").get(getSingleAgency).put(protect, agencyUpload, updateAgency);
agencyRouter.route("/my").get(protect, getUserAgency)

module.exports = {
  agencyRouter,
};


