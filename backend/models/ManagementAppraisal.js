const mongoose = require("mongoose");

const managementAppraisalSchema = new mongoose.Schema({
  empID: { type: String, required: true },
  managementGoals: [
    {
      key: String,
      rating: String,
      comments: String
    },
  ],
  
  submittedAt: Date,
  submittedBy:  {type:String},
  averageSelfRating:  {type:String},
  averageManagerRating:  {type:String},
  averageManagementRating:  {type:String},

});

module.exports = mongoose.model("ManagementAppraisal", managementAppraisalSchema);