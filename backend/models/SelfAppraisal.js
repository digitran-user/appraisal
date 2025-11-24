const mongoose = require("mongoose");

const SelfAppraisalSchema = new mongoose.Schema({
  empID: { type: String, required: true },

  selfGoals: [
    {
      key: { type: String },
      rating: { type: String },
    },
  ],

  self: [
    {
      assessment: { type: String },
      performance: { type: String },
      achievements: { type: String },
      developments: { type: String },
      training: { type: String },
    },
      ],
      submittedAt :{type:String},
});

module.exports = mongoose.model("SelfAppraisal", SelfAppraisalSchema);