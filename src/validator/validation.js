//.................................... Import Models for using in this module ....................//
const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const isValid = function (value) {
  // Validataion for empty request body
  if (Object.keys(value).length === 0) return false;
  else return true;
};

const isValidValue = function (value) {
  // Validation for Strings/ Empty strings
  if (typeof value !== "string") return false;
  else if (value.trim().length == 0) return false;
  else return true;
};

// .......................................Validations for creating authers.......................................//
const validateAuthorFields = async function (req, res, next) {
  try {
    let data = req.body;
    if (!isValid(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Missing all fields." });
    } else {
      const { fname, lname, title, email, password } = req.body;

      // Validation for first name
      if (!fname)
        return res
          .status(400)
          .send({ status: false, msg: "First Name is required" });
      else if (!isValidValue(fname) || /\d/.test(fname))
        return res.status(400).send({
          status: false,
          msg: "First name is in wrong format",
        });

      // Validation for last name
      if (!lname)
        return res
          .status(400)
          .send({ status: false, msg: "Last Name is required" });
      else if (!isValidValue(lname) || /\d/.test(lname))
        return res
          .status(400)
          .send({ status: false, msg: "Last name is in wrong format" });

      // Validation for title
      let data = ["Mr", "Mrs", "Miss"];
      if (!title)
        return res
          .status(400)
          .send({ status: false, msg: "Title is required" });
      else if (!isValidValue(title) || /\d/.test(title))
        return res
          .status(400)
          .send({ status: false, msg: "Title is in wrong format" });
      else if (!data.includes(title))
        return res.status(400).send({
          status: false,
          msg: "Invalid title,selects from 'Mr','Mrs' and 'Miss'",
        });

      // Validation for password
      if (!password)
        return res
          .status(400)
          .send({ status: false, msg: "Password is required" });
      else if (!isValidValue(password))
        return res
          .status(400)
          .send({ status: false, msg: "Please enter your password" });
      else if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
          password
        )
      )
        return res.status(400).send({
          status: false,
          msg: "Minimum length should be 8 characters contain one special charcter , one alphabet and one number",
        });

      // Validation for email
      if (!email)
        return res
          .status(400)
          .send({ status: false, msg: "Email is required" });
      else if (!isValidValue(email))
        return res
          .status(400)
          .send({ status: false, msg: "Please enter your email id" });
      else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return res.status(400).send({ status: false, msg: "Invalid email" });

      const emailId = await authorModel.find().select({ email: 1, _id: 0 });
      const emailInData = emailId.map((ele) => ele.email);
      if (emailInData.includes(email))
        return res
          .status(400)
          .send({ status: false, msg: `${email} is already exist` });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

//.......................................Validations for creating blogs.......................................//
const validateBlogFields = async function (req, res, next) {
  try {
    let data = req.body;

    // If no data found in body
    if (!isValid(data)) {
      return res.status(400).send({ status: false, msg: "Missing Parameters" });
    } else {
      const { title, body, authorId, tags, category, subcategory } = req.body;

      // Validation for ltitle
      if (!title)
        return res
          .status(400)
          .send({ status: false, msg: "Title is required" });
      else if (!isValidValue(title))
        return res
          .status(400)
          .send({ status: false, msg: "Title is in wrong format" });

      // Validation for body
      if (!body)
        return res.status(400).send({ status: false, msg: "Body is required" });
      else if (!isValidValue(body))
        return res
          .status(400)
          .send({ status: false, msg: "Body is in wrong format" });

      // Validation for authorId
      if (!authorId)
        return res
          .status(400)
          .send({ status: false, msg: "Author id is required" });
      else if (!isValidValue(authorId))
        return res
          .status(400)
          .send({ status: false, msg: "Author id is in wrong format" });

      // Validation for tags
      if (!tags)
        return res
          .status(400)
          .send({ status: false, msg: "Tags are required" });
      else if (tags.length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "Tags are in wrong format" });

      // Validation for category
      if (!category)
        return res
          .status(400)
          .send({ status: false, msg: "Category is required" });
      else if (!isValidValue(category))
        return res
          .status(400)
          .send({ status: false, msg: "categories are in wrong format" });

      // Validation for subcategory
      if (!subcategory)
        return res
          .status(400)
          .send({ status: false, msg: "subategory is required" });
      else if (subcategory.length === 0)
        return res
          .status(400)
          .send({ status: false, msg: "Subcategory is in wrong format" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

//.........................................Validations for updating blogs.......................................//
const validateUpdateBlogFields = async function (req, res, next) {
  let data = req.body;

  // If no data found in body
  if (!isValid(data)) {
    return res.status(400).send({ status: false, msg: "Missing Parameters" });
  }
  try {
    const { title, body, tags, subcategory } = req.body;
    let msg = "";

    // Validation for title
    if (title && !isValidValue(title)) msg = "Title is in wrong format";

    // Validation for body
    if (body && !isValidValue(body)) msg = "Body is in wrong format";

    // Validation for tags
    if (tags && tags.length == 0) msg = "Tags are in wrong format";

    // Validation for subcategory
    if (subcategory && subcategory.length == 0)
      msg = "Subcategory are in wrong format";

    if (msg) return res.status(400).send({ status: false, msg: msg });

    // Return error if blog id is not valid
    let blogId = req.params.blogId;
    if (!ObjectId.isValid(blogId)) {
      return res
        .status(400)
        .send({ status: false, msg: `${blogId} is not valid` });
    }

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog Id is incorrect" });
    } else if (blog.isDeleted) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog is already deleted" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

// ....................................Validation for delete blogs by path params.......................................//
const validateDeleteBlogParam = async function (req, res, next) {
  try {
    const { blogId } = req.params;
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res
        .status(404)
        .send({ status: false, msg: "Blog Id is incorrect" });
    } else if (blog.isDeleted) {
      return res
        .status(200)
        .send({ status: false, msg: "Blog is already deleted" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

//.......................................Validation for delete blogs by query params.......................................//
const validateQueryParams = async function (req, res, next) {
  try {
    let data = req.query;
    if (!isValid(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Missing query Parameters" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

const validateLoginAuthor = async function (req, res, next) {
  try {
    let data = req.body;
    if (!isValid(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Missing all fields." });
    } else {
      const { email, password } = req.body;
      let msg = "";

      if (!password) msg = "Password is required";
      else if (!isValidValue(password)) msg = "Please enter your password";

      if (!email) msg = "Email is required";
      else if (!isValidValue(email)) msg = "Enter your Email";

      if (msg) {
        return res.status(400).send({ status: false, msg: msg });
      }
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
  next();
};

module.exports.validateAuthorFields = validateAuthorFields;
module.exports.validateBlogFields = validateBlogFields;
module.exports.validateUpdateBlogFields = validateUpdateBlogFields;
module.exports.validateDeleteBlogParam = validateDeleteBlogParam;
module.exports.validateQueryParams = validateQueryParams;
module.exports.validateLoginAuthor = validateLoginAuthor;
