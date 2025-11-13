import express from "express";
import ReporteeAppraisal from "../models/reporteeAppraisalModel.js";

const router = express.Router();

// Save or update reportee appraisal
router.post("/", async (req, res) => {
  try {
    const { empID, managerGoals, manager } = req.body;

    if (!empID) {
      return res.status(400).json({ message: "empID is required" });
    }

    // Check if appraisal already exists for this employee
    let existing = await ReporteeAppraisal.findOne({ empID });

    if (existing) {
      existing.managerGoals = managerGoals;
      existing.manager = manager;
      await existing.save();
      return res.status(200).json({ message: "Appraisal updated successfully" });
    }

    const newAppraisal = new ReporteeAppraisal({
      empID,
      managerGoals,
      manager,
    });

    await newAppraisal.save();
    res.status(201).json({ message: "Appraisal created successfully" });
  } catch (err) {
    console.error("❌ Error saving appraisal:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
