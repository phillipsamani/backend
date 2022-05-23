const express = require("express");
const router = express.Router();
const {
  create,
  list,
  yearWithitsSubstrands,
  yearWithRelatedSubstrands
} = require("../controllers/year");        

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/year", requireSignin, adminMiddleware, create);     
router.post("/year-substrands/:slug", yearWithRelatedSubstrands);
router.post("/year-all-substrands/:slug", yearWithitsSubstrands,);

router.get("/years", list);

module.exports = router;
