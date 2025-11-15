const express = require("express");
const {
  createElectedBodyMember,
  getElectedBodyMembers,
  getElectedBodyMemberById,
  updateElectedBodyMember,
  deleteElectedBodyMember,
} = require("../controllers/electedBody.controller");
const { protect } = require("../middlewares/authMiddleware");
const { electedBodyUpload } = require("../middlewares/uploadMiddleware"); // Add this import

const electedBodyRouter = express.Router();

electedBodyRouter
  .route("/")
  .get(getElectedBodyMembers)
  .post(protect, electedBodyUpload.single('photo'), createElectedBodyMember); // Add middleware

electedBodyRouter
  .route("/:id")
  .get(getElectedBodyMemberById)
  .put(protect, electedBodyUpload.single('photo'), updateElectedBodyMember) // Add middleware
  .delete(protect, deleteElectedBodyMember);

module.exports = {
  electedBodyRouter,
};