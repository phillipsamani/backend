const Foreword = require("../models/foreword");
const Section = require("../models/section");
// const Syllabus = require("../models/syllabus");
// const Introduction = require("../models/introduction");
// const Rationale = require("../models/rationale");
// const Aim = require("../models/aim");
// const Strand = require("../models/strand");
// const Year = require("../models/year");
const formidable = require("formidable");
const slugify = require("slugify");
const { smartTrim } = require("../helpers/strand");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
// const config = require("config");
// const { default: Aim } = require("../../client/components/aim/aimModal");
// const appName = config.get("APP_NAME");

//make sectionId available in a request
exports.forewordById = (req, res, next, id) => {
  Foreword.findById(id)
    .exec((err, foreword) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.foreword = foreword;
      next();
    });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { subject, section, differentiator, title, body } = fields;

    if (!subject || subject.length === 0) {
      return res.status(400).json({
        error: "A subject is required",
      });
    }
    if (!section || section.length === 0) {
      return res.status(400).json({
        error: "A section is required",
      });
    }

    if (!differentiator || differentiator.length === 0) {
      return res.status(400).json({
        error: "A statement is requied for the slug development",
      });
    }
    if (!body || body.length === 0) {
      return res.status(400).json({
        error: "A body is required",
      });
    }

    let foreword = new Foreword();
    foreword.subject = subject;
    foreword.section = section;
    foreword.title = title;
    foreword.differentiator = differentiator;
    foreword.body = body;

    foreword.slug = slugify(differentiator).toLowerCase();

    foreword.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result)
    });
  });
};


exports.getSyllabusForeword = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  const { subject } = req.body.syllabus;
  //console.log(subject)

  Section.findOne({ slug }).exec((err, section) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }

    Foreword.find({ section: section, subject: { $in: subject } })
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data)

      });
  });
};

exports.list = (req, res) => {
  Foreword.find({})
      .populate("subject", "_id name slug")
      .select("_id subject slug")
      .exec((err, data) => {
          if (err) {
              return res.status(400).json({
                  error: errorHandler(err),
              });
          }
          res.json(data);
      });
};

