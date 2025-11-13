const mongoose = require("mongoose");

const managerAppraisalSchema = new mongoose.Schema({
  empID: { type: String, required: true },
  managerGoals: [
    {
      key: String,
      rating: String,
      achievements: String
    },
  ],
  manager: { type: Array, default: [] },
  submittedAt: Date,
  comments: {type:String},
});

module.exports = mongoose.model("ManagerAppraisal", managerAppraisalSchema);