const express = require("express");
const router = express.Router();
const {
    indicatorById,
    create,

} = require("../controllers/indicator");

// validators
const { runValidation } = require("../validators");
const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post(
    "/indicator",

    runValidation,
    requireSignin,
    adminMiddleware,
    create
);

router.param("indicatorId", indicatorById);

module.exports = router;
