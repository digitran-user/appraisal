const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
 empID: String,
 empName: String,
 grade:String,
 designation:String,
 department:String,
 assessmentType:String,
 assessmentCycle:String,
 management:String,
 doj:String,
 location:String,
 assPeriod :String,
 servicePeriod: String,
 reportsTo:String,
 performanceSummary:String,
achievements:String,
developments:String,
training:String,
suggestedPerformanceSummary:String,
suggestedAchievements:String,
suggestedDevelopments:String,
suggestedTrainings:String,
});

module.exports = mongoose.model("Employee", empSchema);