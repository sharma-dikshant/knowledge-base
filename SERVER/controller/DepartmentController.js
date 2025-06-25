const Department = require("../models/departmentModel");

exports.getAllDepartments = async (req, res, next) => {
  try {
    const docs = await Department.find({}).select("name departmentId");
    return res.status(200).json({
      departments: docs,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      error,
    });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const newDoc = await Department.create(req.body);

    return res.status(200).json({
      message: "department created successfully",
      data: newDoc,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, error });
  }
};

exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.find();
    if (!department) {
      return res.status(500).json({ message: "intern server error", error });
    }
    return res
      .status(201)
      .json({ message: "department fetched successfully", data: department });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
