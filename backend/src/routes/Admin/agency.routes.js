const express = require("express");
const { addAgencyController } = require("../../controllers/Admin/agency.controller");
const { getAgenciesController, getSingleAgency } = require("../../controllers/Public/publicAgency.controller");
const agencyRouter = express.Router();

agencyRouter.route("/")
.post(addAgencyController)
.get(getAgenciesController);

agencyRouter.route("/:id").get(getSingleAgency);

module.exports = {
    agencyRouter
}