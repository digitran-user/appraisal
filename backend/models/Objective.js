const mongoose = require("mongoose");

const empSchema = new mongoose.Schema({
  grade: String,
  objectives: [
    {
      key: String,
      value: String,
      per:Number
    }
],
    goals: [
       {
      key: String,
      value: String,
      per:Number
      } 
],
   
    aoas: [
      {
        key: String,
        value: String
      }
    ]



  
});

module.exports = mongoose.model("Objective", empSchema);