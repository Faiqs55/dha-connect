const express = require("express");
const { getAllProperties, createPropertyController, updatePropertyStatusController, getSinglePropertyController, updatePropertyController, deletePropertyController, getAgentPropertiesController, getAgencyProperties } = require("../controllers/property.cntroller");
const { isAgent, protect } = require("../middlewares/authMiddleware");

const propertyRouter = express.Router();

propertyRouter.route("/")
.get(getAllProperties)
.post(isAgent, createPropertyController);

propertyRouter.route("/:id")
.get(getSinglePropertyController)
.put(isAgent, updatePropertyController);
propertyRouter.route("agency/:id")
.delete(protect, deletePropertyController);
propertyRouter.route("agent/:id")
.delete(isAgent, deletePropertyController);

propertyRouter.get("/get/agent/properties", isAgent, getAgentPropertiesController);
propertyRouter.get("/get/agency/properties", protect, getAgencyProperties)

propertyRouter.put("/:id/status", protect, updatePropertyStatusController);

module.exports = {
    propertyRouter
}