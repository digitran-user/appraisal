const express = require("express");
const Objective = require("../models/Objective");

const router = express.Router();

// GET objectives by grade
router.get("/:grade", async (req, res) => {
  try {
    const grade = req.params.grade.toUpperCase();
    const objectiveData = await Objective.findOne({ grade });

    if (!objectiveData) {
      return res.status(404).json({ objectives: [] });
    }

    res.json(objectiveData);
  } catch (err) {
    console.error("Error fetching objectives:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
