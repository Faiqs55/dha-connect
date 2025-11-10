const express = require("express");
const {
  createPhaseName,
  getPhaseNames,
  updatePhaseName,
  deletePhaseName,
} = require("../controllers/phaseNameController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", getPhaseNames);
router.post("/", protect, createPhaseName);
router.put("/:id", protect, updatePhaseName);
router.delete("/:id", protect, deletePhaseName);

module.exports = router;


