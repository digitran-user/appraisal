const mongoose = require("mongoose");

// 🧩 Sub-schema for detailed assessment fields
const appraisalSectionSchema = new mongoose.Schema(
  {
    assessment: { type: String, default: "" },
    performance: { type: String, default: "" },
    achievements: { type: String, default: "" },
    developments: { type: String, default: "" },
    training: { type: String, default: "" },
  },
  { _id: false } // Prevents unwanted nested _id fields
);

// 🧩 Sub-schema for goal ratings
const goalSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
  //value: { type: String, default: "" }, // Goal name
  //per: { type: Number, default: 0 },    // Weight %
  achievement: { type: Number, default: null },
  previousCycleRating: { type: Number, default: null },
  rating: { type: Number, default: null },
  },
  { _id: false }
);

// 🧩 Appraisal schema grouping all parts together
const appraisalSchema = new mongoose.Schema(
  {
    self: { type: [appraisalSectionSchema], default: [] },
    manager: { type: [appraisalSectionSchema], default: [] },
    selfGoals: { type: [goalSchema], default: [] },
    managerGoals: { type: [goalSchema], default: [] },
    managementGoals: { type: [goalSchema], default: [] },
    submittedBy: { type: String, required: true },
    submittedAt: { type: Date}
  },
  { _id: false } // Keeps your document clean
);

// 🧩 Main Employee Schema
const empSchema = new mongoose.Schema(
  {
    empID: { type: String, required: true, unique: true },
    empName: { type: String, required: true },
    grade: { type: String },
    designation: { type: String },
    department: { type: String },
    assessmentType: { type: String },
    assessmentCycle: { type: String },
    management: { type: String },
    doj: { type: String },
    location: { type: String },
    assPeriod: { type: String },
    servicePeriod: { type: String },
    reportsTo: { type: String },

    performanceSummary: { type: String, default: "" },
    achievements: { type: String, default: "" },
    developments: { type: String, default: "" },
    training: { type: String, default: "" },

    suggestedPerformanceSummary: { type: String, default: "" },
    suggestedAchievements: { type: String, default: "" },
    suggestedDevelopments: { type: String, default: "" },
    suggestedTrainings: { type: String, default: "" },

    // ✅ Appraisal block
    appraisal: { type: appraisalSchema, default: () => ({}) },
  },
  { timestamps: true } // Auto add createdAt & updatedAt
);

module.exports = mongoose.model("Employee", empSchema);
