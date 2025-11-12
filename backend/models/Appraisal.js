import mongoose from "mongoose";

const appraisalSchema = new mongoose.Schema({
  empID: {
    type: String,
    required: true,
    index: true, // easy lookup by employee
  },

  // 🔹 Goals filled by employee (self)
  selfGoals: [
    {
      key: String,
      rating: Number,
      //achievement: Number,
      //previousCycleRating: Number,
      weight: Number,
    },
  ],

  // 🔹 Employee self-assessment sections
  selfAssessment: [
    {
      area: String,            // optional: area of assessment (like communication, teamwork)
      assessment: String,      // employee's self-assessment
      performance: String,     // performance summary
      achievements: String,    // achievements
      developments: String,    // areas of improvement
      training: String,        // training needs
    },
  ],

  // 🔹 Optional overall average or remarks
  selfAverage: Number,

  // 🔹 Meta Info
  submittedBy: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Appraisal", appraisalSchema);
