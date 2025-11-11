const express = require("express");
const {
  createContactQuery,
  getContactQueries,
} = require("../controllers/contactQueryController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createContactQuery);
router.get("/", protect, getContactQueries);

module.exports = router;


