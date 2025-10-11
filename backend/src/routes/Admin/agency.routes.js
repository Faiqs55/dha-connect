const express = require("express");
const { addAgencyController } = require("../../controllers/Admin/agency.controller");
const { getAgenciesController } = require("../../controllers/Public/publicAgency.controller");
const agencyRouter = express.Router();

agencyRouter.route("/")
.post(addAgencyController)
.get(getAgenciesController);

module.exports = {
    agencyRouter
}