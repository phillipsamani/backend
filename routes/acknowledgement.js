const express = require("express");
const router = express.Router();
const { create, list, getAcknowledgement } = require("../controllers/acknowledgement");
// const { yearById } = require("../controllers/year");
// validators
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/acknowledgement",
    requireSignin,
    adminMiddleware,
    create);
router.post("/syllabus-acknowledgement/:slug", getAcknowledgement);
router.get("/acknowledgements", list);
// router.get("/:slug", read);

// router.param("yearId", yearById);

module.exports = router;