const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read
} = require("../controllers/substrand");

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/substrand", requireSignin, adminMiddleware, create);
router.get("/substrands", list);
router.get("/substrand/:slug", read);

module.exports = router;
