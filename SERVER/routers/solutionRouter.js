const express = require("express");
const solutionController = require("./../controller/solutionController");
const authController = require("./../controller/AuthController");
const router = express.Router();

router.get("/:solutionId", solutionController.getSolution);

router.use(
  authController.protected,
  authController.restrictTo("admin", "moderator")
);
router.post("/:postId", solutionController.createSolution);
router.patch("/:solutionId", solutionController.updateSolution);
router.delete("/:solutionId", solutionController.deleteSolution);

module.exports = router;
