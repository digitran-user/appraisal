// server.js (or routes/appraisalRoutes.js)
import express from "express";
import mongoose from "mongoose";
import Appraisal from "./models/Appraisal.js";

const router = express.Router();

// 🔹 Save or update self appraisal
router.post("/api/appraisals/save", async (req, res) => {
  try {
    const { empID, selfGoals, selfAssessment, selfAverage, submittedBy } = req.body;

    if (!empID) return res.status(400).json({ message: "Employee ID is required" });

    // Check if appraisal already exists
    let appraisal = await Appraisal.findOne({ empID });

    if (appraisal) {
      // update existing
      appraisal.selfGoals = selfGoals || appraisal.selfGoals;
      appraisal.selfAssessment = selfAssessment || appraisal.selfAssessment;
      appraisal.selfAverage = selfAverage || appraisal.selfAverage;
      appraisal.submittedBy = submittedBy || appraisal.submittedBy;
      appraisal.submittedAt = new Date();
      await appraisal.save();
    } else {
      // create new
      appraisal = new Appraisal({
        empID,
        selfGoals,
        selfAssessment,
        selfAverage,
        submittedBy,
      });
      await appraisal.save();
    }

    res.json({ message: "✅ Appraisal saved successfully", appraisal });
  } catch (err) {
    console.error("❌ Error saving appraisal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Fetch appraisal by employee ID
router.get("/api/appraisals/:empID", async (req, res) => {
  try {
    const appraisal = await Appraisal.findOne({ empID: req.params.empID });
    res.json(appraisal || {});
  } catch (err) {
    console.error("❌ Error fetching appraisal:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
