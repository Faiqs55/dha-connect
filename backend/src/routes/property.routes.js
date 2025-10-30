const express = require("express");
const { getAllProperties, createPropertyController, getSinglePropertyComtroller, updatePropertyController, deletePropertyController, getAgentPropertiesController } = require("../controllers/property.cntroller");
const { isAgent, protect } = require("../middlewares/authMiddleware");

const propertyRouter = express.Router();

propertyRouter.route("/")
.get(getAllProperties)
.post(isAgent, createPropertyController);

propertyRouter.route("/:id")
.get(getSinglePropertyComtroller)
.put(isAgent, updatePropertyController);
propertyRouter.route("agency/:id")
.delete(protect, deletePropertyController);
propertyRouter.route("agent/:id")
.delete(isAgent, deletePropertyController);

propertyRouter.get("/get/agent/properties", isAgent, getAgentPropertiesController)

module.exports = {
    propertyRouter
}