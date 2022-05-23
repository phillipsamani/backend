const express = require("express");
const router = express.Router();
const {
  create,
  list,
  // listCategoryWithAllSyllabuses,
  read,
  readCategory,
  remove,
} = require("../controllers/category");

// validators
const { runValidation } = require("../validators");
const { categoryValidator } = require("../validators/category");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post(        
  "/category",
  requireSignin,
  adminMiddleware,
  create
);

router.get("/categories", list);
router.get("/category/:slug", read);
router.post("/category/:slug", readCategory);
//router.post("/category-syllabuses/:slug", listCategoryWithAllSyllabuses);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);

module.exports = router;
