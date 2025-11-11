const express = require("express");
const router = express.Router();
const {
  createPhase,
  getPhases,
  getPhaseById,
  updatePhase,
  deletePhase,
} = require("../controllers/phaseController");
const { protect } = require("../middlewares/authMiddleware");

// Public routes (no authentication required)
router.get("/", getPhases);
router.get("/:id", getPhaseById);

// Protected routes (authentication required)
router.post("/", protect, createPhase);
router.put("/:id", protect, updatePhase);
router.delete("/:id", protect, deletePhase);

module.exports = router;

