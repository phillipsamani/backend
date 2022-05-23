const express = require("express");
const router = express.Router();
const {
  create,
  read,
  list,
} = require("../controllers/syllabus");

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/syllabus", requireSignin, adminMiddleware, create);
router.get("/syllabus/:slug", read);
router.get("/syllabuses", list);

module.exports = router;
