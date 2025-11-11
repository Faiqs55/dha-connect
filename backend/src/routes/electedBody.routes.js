const express = require("express");
const {
  createElectedBodyMember,
  getElectedBodyMembers,
  getElectedBodyMemberById,
  updateElectedBodyMember,
  deleteElectedBodyMember,
} = require("../controllers/electedBody.controller");
const { protect } = require("../middlewares/authMiddleware");

const electedBodyRouter = express.Router();

electedBodyRouter
  .route("/")
  .get(getElectedBodyMembers)
  .post(protect, createElectedBodyMember);

electedBodyRouter
  .route("/:id")
  .get(getElectedBodyMemberById)
  .put(protect, updateElectedBodyMember)
  .delete(protect, deleteElectedBodyMember);

module.exports = {
  electedBodyRouter,
};

