const Indicator = require("../models/indicator");

const formidable = require("formidable");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

//variables from config
// const config = require("config");
// const appName = config.get("APP_NAME");

exports.indicatorById = (req, res, next, id) => {
    Indicator.findById(id)
        .populate("indicator")
        .exec((err, indicator) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            req.indicator = indicator;
            next();
        });
};


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
        const {
            subject,
            strand,
            substrand,
            year,
            years,
            term,
            terms,
            content,
            specific,
            activity,
            assessment,

        } = fields;

        if (!content || content.length === 0) {
            return res.status(400).json({
                error: "A content is requied",
            });
        }
        if (!subject || subject.length === 0) {
            return res.status(400).json({
                error: "A subject is requied",
            });
        }

        if (!year || year.length === 0) {
            return res.status(400).json({
                error: "A year is requied",
            });
        }

        if (!strand || strand.length === 0) {
            return res.status(400).json({
                error: "A Strand is requied",
            });
        }

        if (!specific || specific.length === 0) {
            return res.status(400).json({
                error: "A specific learning outcome is required",
            });
        }
        if (!assessment || assessment.length === 0) {
            return res.status(400).json({
                error: "An assessment item is required",
            });
        }

        if (!substrand || substrand.length === 0) {
            return res.status(400).json({
                error: "A substrand is required",
            });
        }

        let indicator = new Indicator();
        indicator.content = content;
        indicator.subject = subject;
        indicator.strand = strand;
        indicator.specific = specific;
        indicator.activity = activity;
        indicator.assessment = assessment;
        indicator.year = year;
        indicator.term = term;
        indicator.substrand = substrand;
        indicator.slug = slugify(content).toLowerCase();
        indicator.mtitle = `${content}`;

        let arrayOfYears = years && years.split(",");
        let arrayOfTerms = terms && terms.split(",");

        indicator.save((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            Indicator.findByIdAndUpdate(
                data._id,
                { $push: { years: arrayOfYears } },
                { new: true }
            ).exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err),
                    });
                } else {
                    Indicator.findByIdAndUpdate(
                        result._id,
                        { $push: { terms: arrayOfTerms } },
                        { new: true }
                    ).exec((err, output) => {
                        if (err) {
                            return res.status(400).json({
                                error: errorHandler(err),
                            });
                        } else {
                            res.json(output)
                                ;
                        }
                    });
                }
            });
        });
    });
};
