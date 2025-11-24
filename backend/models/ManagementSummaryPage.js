const mongoose = require("mongoose");

const managementSummarySchema = new mongoose.Schema({
  empID: { type: String, required: true },
  managementGoals: [
    {
      key: String,
      rating: Number,
      comments: String,
      overallRating:Number
    },
  ],
  
  submittedAt: Date,
  submittedBy:  {type:String},
  averageSelfRating:  {type:String},
  averageManagerRating:  {type:String},
  averageManagementRating:  {type:String},
 averageOverallRating: {type:String}
});

module.exports = mongoose.model("ManagementSummaryPage", managementSummarySchema);