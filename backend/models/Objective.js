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
    ]

  
});

module.exports = mongoose.model("Objective", empSchema);