const express = require("express");
const router = express.Router();
const {
  create,
  list,
  read
} = require("../controllers/subject");

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/subject", requireSignin, adminMiddleware, create);
router.get("/subjects", list);
router.get("/subject/:slug", read);

module.exports = router;
