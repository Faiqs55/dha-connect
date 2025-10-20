const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addStaffController, getAllStaffController, getSingleStaffController, updateStaffController } = require("../controllers/staff.controller");
const staffRouter = express.Router();

staffRouter.post("/", protect, addStaffController);
staffRouter.get("/all/:agencyId", getAllStaffController);
staffRouter.get("/:id", getSingleStaffController);
staffRouter.put("/:id", protect, updateStaffController);

module.exports = {
    staffRouter
}