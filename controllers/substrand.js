const Substrand = require("../models/substrand");
const Strand = require("../models/strand");
// const Outcome = require("../models/outcome");
const Year = require("../models/year");
// const Syllabus = require("../models/syllabus");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");

const { errorHandler } = require("../helpers/dbErrorHandler");
// const { smartTrim } = require("../helpers/strand");

//variables from config
// const config = require("config");
// const appName = config.get("APP_NAME");

exports.substrandById = (req, res, next, id) => {
  Substrand.findById(id)
    .populate("substrand")
    .exec((err, substrand) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.substrand = substrand;
      next();
    });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    const { subject, year, name, periods, years, statement, strand, term, terms, outcomes } = fields;

    if (!name || name.length === 0) {
      return res.status(400).json({
        error: "A substrand name is required",
      });
    }

    let substrand = new Substrand();
    substrand.subject = subject;
    substrand.year = year;
    substrand.term = term;
    substrand.name = name;
    substrand.periods = periods;
    substrand.statement = statement;
    substrand.strand = strand;

    substrand.slug = slugify(name).toLowerCase();

    let arrayOfTerms = terms && terms.split(",");
    
    let arrayOfOutcomes = outcomes && outcomes.split(",");
    let arrayOfYears = years && years.split(",");

    substrand.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      // console.log(result)
      Substrand.findByIdAndUpdate(
        result._id,
        { $push: { terms: arrayOfTerms } },
        { new: true }
      ).exec((err, output) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        } else {
          // res.json(result);
          Substrand.findByIdAndUpdate(
            output._id,
            { $push: { outcomes: arrayOfOutcomes } },
            { new: true }
          ).exec((err, data) => {
            if (err) {
              return res.status(400).json({
                error: errorHandler(err),
              });
            } else {
              // res.json(data);
              Substrand.findByIdAndUpdate(
                data._id,
                { $push: { years: arrayOfYears } },
                { new: true }
              ).exec((err, output) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                } else {
                  res.json(output);
                  
                }
              })
            }
          })
        }
      });
    });
  });
};



exports.list = (req, res) => {
  Substrand.find({}).exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

// exports.read = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Substrand.findOne({ slug })
//     .populate("strand", "_id title")
//     .populate("subject", "_id name")
//     .populate("level", "_id name slug")
//     .populate("years", "_id name slug")
//     .populate("terms", "_id name")
//     .populate({
//       path: "outcomes",
//       populate: { path: "indicators", model: "Outcome" },
//     })
//     .exec((err, substrand) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }

//       Strand.find({ substrands: substrand })
//         .populate("strand", "_id title")
//         .populate({
//           path: "years",
//           populate: { path: "years", model: "Year" },
//         })
//         .exec((err, data) => {
//           if (err) {
//             return res.json({
//               error: errorHandler(err),
//             });
//           }
//           res.json({ substrand: substrand, strand: data });
//         });
//     });
// };

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  // console.log(slug)
  Substrand.findOne({ slug })
    .populate("strand", "_id name")
    .populate("subject", "_id name")
    .populate("sections", "_id name slug")
    .populate("years", "_id name slug")
    .populate("year", "_id name slug")
    .populate("outcomes", "_id general assessment indicators slug")
    // .populate("terms", "_id name")
    // .populate("term", "_id name")
    // .populate({
    //   path: "outcomes",
    //   populate: { path: "indicators", model: "Indicator" },
    // })
    .select("name periods sections terms term statement strand outcomes subject years year")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      // console.log(data)
      res.json(data)
    });
};


// exports.listRelatedSubstrands = (req, res) => {
//   const { _id, subject } = req.body.substrand;

//   Syllabus.find({
//     subject: { $in: subject },
//   })
//     .populate("sections", "_id title")
//     .select("_id sections title slug")
//     .exec((err, data) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(data);
//     });
// };

// exports.listSubstrandWithSyllabus = (req, res) => {
//   const { subject } = req.body.substrand;

//   Syllabus.find({
//     subject: { $in: subject },
//   })
//     .populate("category", "_id name slug")
//     .populate("subject", "_id name slug")
//     .populate("strands", "_id title slug")
//     .select("_id category subject strands slug")
//     .exec((err, data) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(data);
//     });
// };

/**************PERFORMING WORK HERE********************/
// exports.listRelatedStrands = (req, res) => {
//   const { subject } = req.body.substrand;

//   //console.log(req.body.substrand);

//   Syllabus.findOne({
//     subject: { $in: subject },
//   })

//     .exec((err, subject) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       // res.json(data);
//       Strand.find({ subject })
//         .select("_id title slug")
//         .exec((err, data) => {
//           if (err) {
//             return res.json({
//               error: errorHandler(err),
//             });
//           }
//           res.json(data);
//         });
//     });
// };
// /***************************************************/
// exports.listSubstrandWithStrand = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Substrand.findOne({ slug })
//     .populate("years", "_id name")
//     .populate("subject", "_id name")
//     .exec((err, substrand) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }

//       Strand.find({ substrands: substrand }).exec((err, data) => {
//         if (err) {
//           return res.json({
//             error: errorHandler(err),
//           });
//         }
//         res.json({
//           substrand: substrand,
//           strand: data,
//         });
//       });
//     });
// };

// exports.listSubstrandWithOutcomes = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Substrand.findOne({ slug })
//     .populate("subject", "_id name slug")
//     .populate("years", "_id name slug")
//     .populate("terms", "_id name")
//     .populate("outcomes", "id general")
//     .populate({
//       path: "outcomes",
//       populate: { path: "indicators", model: "Outcome" },
//     })
//     .select(
//       "_id subject title periods statement terms strand general outcomes year "
//     )
//     .exec((err, substrand) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       Strand.find({ substrands: substrand })
//         .populate({
//           path: "years",
//           populate: { path: "years", model: "Year" },
//         })
//         .exec((err, strand) => {
//           if (err) {
//             return res.json({
//               error: errorHandler(err),
//             });
//           }
//           res.json({
//             substrand: substrand,
//             strand: strand,
//           });
//         });
//     });
// };

// exports.remove = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Substrand.findOneAndRemove({ slug }).exec((err, data) => {
//     if (err) {
//       return res.json({
//         error: errorHandler(err),
//       });
//     }
//     res.json({
//       message: "Substrand deleted successfully",
//     });
//   });
// };

// exports.listBySearch = (req, res) => {
//   //let order = req.body.order ? req.body.order : "desc";
//   let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
//   let limit = req.body.limit ? parseInt(req.body.limit) : 100;
//   let skip = parseInt(req.body.skip);
//   let findArgs = {};

//   // console.log(order, sortBy, limit, skip, req.body.filters);
//   // console.log("findArgs", findArgs);

//   for (let key in req.body.filters) {
//     if (req.body.filters[key].length > 0) {
//       if (key === "syllabus") {
//         // gte -  greater than price [0-10]
//         // lte - less than
//         findArgs[key] = {
//           $gte: req.body.filters[key][0],
//           $lte: req.body.filters[key][1],
//         };
//       } else {
//         findArgs[key] = req.body.filters[key];
//       }
//     }
//   }

//   Substrand.find(findArgs)
//     // .sort([[sortBy, order]])
//     .skip(skip)
//     .limit(limit)
//     .exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Substrands not found",
//         });
//       }
//       res.json({
//         size: data.length,
//         data,
//       });
//     });
// };

// exports.listYearSubstrands = (req, res) => {
//   console.log(req.body.substrand);
//   //const slug = req.params.slug.toLowerCase();
//   const { years, strand } = req.body.substrand;

//   Substrand.find({
//     // _id: { $ne: _id },
//     subject: { $in: subject },
//     strand: { $in: strand },
//     years: { $in: years },
//     slug,
//   })
//     .populate("strand", "_id title slug")
//     .select("_id title strand slug")
//     .exec((err, data) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(data);
//     });
// };
