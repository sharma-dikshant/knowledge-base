const express = require("express");
const solutionController = require("./../controller/solutionController");
const authController = require("./../controller/authController");
const router = express.Router();

router.use(authController.protected);
router.get("/:solutionId", solutionController.getSolution);

router.use(authController.restrictTo("admin", "moderator"));
router.post("/posts/:postId", solutionController.createSolution);
router.patch("/:solutionId", solutionController.updateSolution);
router.delete("/:solutionId", solutionController.deleteSolution);

module.exports = router;
