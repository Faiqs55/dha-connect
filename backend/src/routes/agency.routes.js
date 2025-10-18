const express = require("express");
const {
  getAgenciesController,
  getSingleAgency,
  addAgencyController,
  updateAgency,
} = require("../controllers/agency.controller");
const { protect } = require("../middlewares/authMiddleware");
const agencyRouter = express.Router();

agencyRouter.route("/").post(addAgencyController).get(getAgenciesController);

agencyRouter.route("/:id").get(getSingleAgency).put(protect, updateAgency);

module.exports = {
  agencyRouter,
};

// const some = {
//   "agencyName": "DsDen",
//   "agencyEmail": "dsden@gmail.com",
//   "ceoName": "Faiq Sindhu",
//   "ceoPhone": "12345678910",
//   "agencyLogo": "Some Logo URL",
//   "agencyVideo": "Some Video URL",
//   "city": "lahore",
//   "phase": "phase 1",
//   "address": "Some agency Address",
//   "whatsapp": "+92 1234567890",
//   "password": "admin123",
// };
