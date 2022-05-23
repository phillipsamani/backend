const express = require("express");
const router = express.Router();
const {
  create,

  list,
  
} = require("../controllers/term");

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/term", requireSignin, adminMiddleware, create);
router.get("/terms", list);

module.exports = router;
