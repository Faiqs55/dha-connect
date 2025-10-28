const express = require("express");
const { getAllProperties, createPropertyController, getSinglePropertyComtroller, updatePropertyController, deletePropertyController } = require("../controllers/property.cntroller");
const { protect } = require("../middlewares/authMiddleware");

const propertyRouter = express.Router();

propertyRouter.route("/")
.get(getAllProperties)
.post(protect, createPropertyController);

propertyRouter.route("/:id")
.get(getSinglePropertyComtroller)
.put(protect, updatePropertyController)
.delete(protect, deletePropertyController);

module.exports = {
    propertyRouter
}