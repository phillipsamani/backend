const Category = require("../models/category");
const Syllabus = require("../models/syllabus");
const formidable = require("formidable");
const _ = require("lodash");
const slugify = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
      .populate("category")
      .exec((err, category) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
        req.category = category;
        next();
      });
  };
    
      
// exports.create = (req, res) => {
//     const { name, description } = req.body;
//     let slug = slugify(name).toLowerCase();

//     let category = new Category({ name, description, slug });

//     category.save((err, data) => {
//         if (err) {
//             return res.status(400).json({
//                 error: errorHandler(err),
//             });
//         }
//         res.json(data);
//     });
// };

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields) => {
      const { name, years, description } = fields;
  
      if (!name || name.length === 0) {
        return res.status(400).json({
          error: "A substrand name is required",
        });
      }
  
      let category = new Category();      
      category.name = name;
      category.description = description;
        
      category.slug = slugify(name).toLowerCase();
  
      let arrayOfYears = years && years.split(",");
       
      category.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: errorHandler(err),
          });
        }
      
        Category.findByIdAndUpdate(
          result._id,
          { $push: { years: arrayOfYears } },
          { new: true }
        ).exec((err, result) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err),
            });
          } else {
            res.json(result);
          }
        });
      });
    });
  };

exports.list = (req, res) => {
    Category.find({})
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data);
        });
};

exports.listCategoryWithAllSyllabuses = (req, res) => {
    let slug = slugify(name).toLowerCase();
    Category.find({ slug })
        .populate("subject", "_id name")
        .exec((err, category) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(data);
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();


    Category.findOne({ slug })
        .populate("category", "_id name description slug ")
        .populate({
          path: "category",
          populate: { path: "years", model: "Year" },
        })
        .select("_id name slug")
        .exec((err, category) => {

        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }

        Syllabus.find({ category: category })
            .populate("category", "_id name description slug ")
            .populate({
              path: "category",
              populate: { path: "years", model: "Year" },
            })
            .populate("subject", "_id name slug")
            .select("_id category subject excerpt description name slug")
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err),
                    });
                }
                res.json({ category: category, data });
                
            });
    });
};




exports.readCategory = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug })
      .populate("category", "_id name description slug ")
        .populate({
          path: "category",
          populate: { path: "years", model: "Year" },
      })
      .populate("subject", "_id name slug")
      .select("_id years description name slug")
      .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err),
            });
        }
        res.json({
            message: "Category deleted successfully",
        });
    });
};
