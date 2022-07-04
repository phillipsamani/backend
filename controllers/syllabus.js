const Syllabus = require("../models/syllabus");
const Category = require("../models/category");
const Strand = require("../models/strand");
const Section = require('../models/section');
const Subject = require('../models/subject')
const Foreword = require ('../models/foreword')
// const Rationale = require("../models/rationale");
// const Aim = require("../models/aim");
// const Introduction = require("../models/introduction");
// const Tag = require("../models/tag");
// const User = require("../models/user");
const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
// const { smartTrim } = require("../helpers/strand");

//variables from config
// const config = require("config");
// const appName = config.get("APP_NAME");

exports.syllabusById = (req, res, next, id) => {
  Syllabus.findById(id)
    .populate("syllabus")
    .exec((err, syllabus) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      req.syllabus = syllabus;
      next();
    });
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not upload",
      });
    }

    const {
      excerpt,
      description,
      subject,
      category,
      name,
      strands,
      years
    } = fields;

    if (!excerpt || !excerpt.length) {
      return res.status(400).json({
        error: "An excerpt is required",
      });
    }


    if (!name || !name.length) {
      return res.status(400).json({
        error: "A name is required",
      });
    }

    if (!description || !description.length) {
      return res.status(400).json({
        error: "A description is required",
      });
    }


    let syllabus = new Syllabus();
    syllabus.excerpt = excerpt;
    syllabus.description = description;
    syllabus.subject = subject;
    syllabus.name = name;
    syllabus.category = category;
    syllabus.slug = slugify(name).toLowerCase();
    
    let arrayOfStrands = strands && strands.split(",");
    let arrayOfYears = years && years.split(",");
  
    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: "Image should be less then 1mb in size",
        });
      }
      syllabus.photo.data = fs.readFileSync(files.photo.path);
      syllabus.photo.contentType = files.photo.type;
    }

    syllabus.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }

      Syllabus.findByIdAndUpdate(
        result._id,
        { $push: { strands: arrayOfStrands } },
        { new: true }
      )
        .populate("strands", "_id name")
        .populate("category", "_id name")

        .select(
          "_id excerpt strands years category name description slug"
        )
        .exec((err, output) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            // res.json(result);
            Syllabus.findByIdAndUpdate(
              output._id,
              { $push: { years: arrayOfYears } },
              { new: true }
            )
              
              .exec((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: errorHandler(err),
                  });
                } else {
                  res.json(result);
                }
              });
            
          }
        });
    });
  });
};

exports.syllabusForeword = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Subject.findOne({ slug }).exec((err, subject) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    Foreword.find({ subject: { $in: subject } })
      .populate("subject", "_id name slug")
      .exec((err, data) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        res.json(data);
      });
  });
};


// exports.listAllSyllabusesWithCategories = (req, res) => {
//   let limit = req.body.limit ? parseInt(req.body.limit) : 10;
//   let skip = req.body.skip ? parseInt(req.body.skip) : 0;

//   let syllabuses;
//   let categories;

//   Syllabus.find({})
//     .populate("categories", "_id name slug")
//     .populate("subject", "_id name")
//     .skip(skip)
//     .limit(limit)
//     .select("_id subject excerpt categories slug")
//     .exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       syllabuses = data; //All the syllabuses
//       //Get category
//       Category.find({}).exec((err, c) => {
//         if (err) {
//           return res.status(400).json({
//             error: errorHandler(err),
//           });
//         }
//         categories = c;
//         res.json({
//           syllabuses,
//           categories,
//           size: syllabuses.length,
//         });
//       });
//     });
// };

// exports.listAllSyllabusesWithAllContent = (req, res) => {
//   const id = req.params._id;
//   let syllabuses;
//   let rationales;
//   let aims;
//   let introductions;

//   Syllabus.find({ id })
//     .populate("category", "_id name slug")
//     .populate("strands", "_id years title statement substrands")
//     .select("_id title introduction aim rationale strands category slug")
//     .exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       syllabuses = data; //All the syllabuses
//       //Get all rationale
//       Rationale.find({})
//         // .populate("rationale", "_id title body excerpt rationale")
//         .exec((err, r) => {
//           if (err) {
//             return res.status(400).json({
//               error: errorHandler(err),
//             });
//           }
//           rationales = r;
//           //Get all aim
//           Aim.find({}).exec((err, a) => {
//             if (err) {
//               return res.status(400).json({
//                 error: errorHandler(err),
//               });
//             }
//             aims = a;
//             //Get all introduction
//             Introduction.find({}).exec((err, i) => {
//               if (err) {
//                 return res.status(400).json({
//                   error: errorHandler(err),
//                 });
//               }

//               introductions = i;

//               res.json({
//                 syllabuses,
//                 rationales,
//                 aims,
//                 introductions,
//               });
//             });
//           });
//         });
//     });
// };

exports.list = (req, res) => {
  Syllabus.find({})
    .populate("subject", "_id name")
    // .populate("rationale", "_id title body excerpt rationale")
    .populate("category", "_id name slug")
    // .populate("aim", "_id title body excerpt aim")
    // .populate("introduction", "_id title body excerpt introduction")
    // .populate({
    //   path: "strands",
    //   populate: {
    //     path: "substrands",
    //     populate: { path: "years", model: "Year" },
    //   },
    // })
    .select("_id excerpt description subject slug ")
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }        
      res.json(data);
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();     
    
  // const { slug } = req.body.syllabus
  Syllabus.findOne({ slug })
    .populate("subject", "_id name slug")
    .populate("category", "_id name years slug")
    .populate({
      path: "category",
      populate: { path: "years", model: "Year" },
    })
    .select(
      "_id category years subject strands description name slug "
    )
    .exec((err, syllabus) => {
      if (err) {
        return res.json({
          error: errorHandler(err),
        });
      }
      res.json({syllabus: syllabus});
    });
};


// exports.read = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Syllabus.findOne({ slug })
//     .populate("subject", "_id name slug")
//     .populate("category", "_id name slug")
//     .populate("aim", "_id title body excerpt aim ")
//     .populate("introduction", "_id title body excerpt introduction")
//     .populate("rationale", "_id title body excerpt rationale")
//     .populate({
//       path: "strands",
//       populate: {
//         path: "substrands",
//         populate: { path: "years", model: "Year" },
//         path: "substrands",
//         populate: {
//           path: "outcomes",
//           populate: { path: "subject", model: "Subject" },
//         },
//       },
//     })
//     .populate("years", "_id name slug")
//     .populate({
//       path: "strands",
//       populate: {
//         path: "years",
//         populate: { path: "years", model: "Year" },
//       },
//     })
//     .select(
//       "_id years subject introduction aim rationale category strands slug "
//     )
//     .exec((err, syllabus) => {
//       if (err) {
//         return res.json({
//           error: errorHandler(err),
//         });
//       }
//       res.json({ syllabus });
//     });
// };

// exports.remove = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Syllabus.findOneAndRemove({ slug }).exec((err, data) => {
//     if (err) {
//       return res.json({
//         error: errorHandler(err),
//       });
//     }
//     res.json({
//       message: "Syllabus deleted successfully",
//     });
//   });
// };

// exports.update = (req, res) => {
//   const slug = req.params.slug.toLowerCase();

//   Syllabus.findOne({ slug }).exec((err, oldBlog) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }

//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, (err, fields, files) => {
//       if (err) {
//         return res.status(400).json({
//           error: "Image could not upload",
//         });
//       }

//       let slugBeforeMerge = oldSyllabus.slug;
//       oldSyllabus = _.merge(oldSyllabus, fields);
//       oldSyllabus.slug = slugBeforeMerge;

//       const { name, introduction, aim, rationale, category, strands } = fields;

//       if (aim) {
//         oldSyllabus.excerpt = smartTrim(aim, 120, " ", " ...");
//         oldSyllabus.desc = stripHtml(aim.substring(0, 100));
//       }
//       if (rationale) {
//         oldSyllabus.excerpt1 = smartTrim(rationale, 120, " ", " ...");
//         oldSyllabus.desc1 = stripHtml(rationale.substring(0, 100));
//       }
//       if (introduction) {
//         oldSyllabus.excerpt2 = smartTrim(introduction, 320, " ", " ...");
//         oldSyllabus.desc2 = stripHtml(introduction.substring(0, 160));
//       }

//       if (strands) {
//         oldSyllabus.strands = strands.split(",");
//       }

//       if (files.photo) {
//         if (files.photo.size > 10000000) {
//           return res.status(400).json({
//             error: "Image should be less then 1mb in size",
//           });
//         }
//         oldSyllabus.photo.data = fs.readFileSync(files.photo.path);
//         oldSyllabus.photo.contentType = files.photo.type;
//       }

//       oldSyllabus.save((err, result) => {
//         if (err) {
//           return res.status(400).json({
//             error: errorHandler(err),
//           });
//         }
//         result.photo = undefined;
//         res.json(result);
//       });
//     });
//   });
// };

// exports.photo = (req, res) => {
//   const slug = req.params.slug.toLowerCase();
//   Syllabus.findOne({ slug })
//     .select("photo")
//     .exec((err, syllabus) => {
//       if (err || !syllabus) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       res.set("Content-Type", syllabus.photo.contentType);
//       return res.send(syllabus.photo.data);
//     });
// };

// exports.listSyllabusRelatedStrand = (req, res) => {
//   const id = req.params._id;
//   Syllabus.findOne({ id }).exec((err, subject) => {
//     if (err) {
//       return res.status(400).json({
//         error: errorHandler(err),
//       });
//     }
//     Strand.find({ subject: subject }).exec((err, data) => {
//       if (err) {
//         return res.status(400).json({
//           error: errorHandler(err),
//         });
//       }
//       res.json(data);
//     });
//   });
// };
