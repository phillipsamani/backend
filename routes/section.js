const express = require("express");
const router = express.Router();
const { create,
    list,
    read,
    // getSectionWithSyllabus, 
    getSyllabusSections,
    getSectionSyllabus,
    // listSubstrandSyllabusContent
} = require("../controllers/section");

const { requireSignin, adminMiddleware } = require("../controllers/auth");

router.post("/section",
    requireSignin,
    adminMiddleware,
    create);
// router.post("/section-syllabus/:slug", getSectionWithSyllabus);
router.post("/syllabus-section/:slug", getSyllabusSections);
router.post("/syllabus-section-substrand/:slug", getSectionSyllabus);
// router.post("/section-substrand-syllabus", listSubstrandSyllabusContent);
router.get("/sections", list);
router.get("/section/:slug", read);

module.exports = router;
