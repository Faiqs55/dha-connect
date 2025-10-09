const express = require("express");
const { addAgencyController } = require("../../controllers/Admin/agency.controller");
const agencyRouter = express.Router();

agencyRouter.route("/")
.post(addAgencyController);

module.exports = {
    agencyRouter
}