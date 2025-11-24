import mongoose from "mongoose";

const ManagerGoalsSchema = new mongoose.Schema({
  key: { type: String, required: true },
  rating: { type: Number, default: 0 },
  achievements: { type: Number, default: 0 }, // achievement %
  averageSelfRating: { type: Number, default: 0 },
    averageManagerRating: { type: Number, default: 0 },
});

const ManagerAssessmentSchema = new mongoose.Schema({
  assessment: { type: String, default: "" },
  performance: { type: String, default: "" },
  achievements: { type: String, default: "" },
  developments: { type: String, default: "" },
  training: { type: String, default: "" },
});

const ReporteeAppraisalSchema = new mongoose.Schema(
  {
    empID: { type: String, required: true },
    managerGoals: [ManagerGoalsSchema],
    manager: [ManagerAssessmentSchema],
    comments: { type: String, default: "" }, // ✅ ADD THIS
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


export default mongoose.model("ReporteeAppraisal", ReporteeAppraisalSchema);
