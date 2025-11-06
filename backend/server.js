const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Employee = require("./models/Employee");
const Objective = require("./models/Objective");
const objectiveRoutes = require("./routes/objectiveRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/empDetails", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

 // import objectiveRoutes from "./routes/objectiveRoutes.js";
app.use("/api/objectives", objectiveRoutes);


// ✅ API to get all employee data
app.get("/api/emp/:empId", async (req, res) => {
  try {
    
    const empId = req.params.empId; // Get empId from URL
console.log(empId);
    // Find one employee where empId matches
    const employee = await Employee.findOne({ "empID": empId });
    console.log(employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Employee not found" });
  }
});

//Find the reportees
app.get("/api/reportees/:empId", async (req, res) => {
  try {
    const empId = req.params.empId;
    const reportees = await Employee.find({ "managerID":empId });
   if (!reportees.length) {
      return res.status(404).json({ message: "No reportees found" });
    }

    res.json(reportees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});
// ✅ (Optional) Add test data
app.put("/api/appraisals/:empId", async (req, res) => {
  try {
    const { empId } = req.params;
  
    const updates = req.body; // dynamic fields sent from frontend

    // Find the employee by empId and update only given fields
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empID: empId },
      { $set: updates },  // ✅ only updates provided fields
      { new: true }       // return the updated document
    );
    console.log(updatedEmployee);
    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Error updating employee:", error);
    res.status(500).json({ error: "Server error" });
  }


});
//FETCH objectives
  app.get("/api/objectives/:grade", async (req, res) => {
  try {
        console.log(req.params.grade);
    const grade = req.params.grade; // Get empId from URL

    // Find one employee where empId matches
    const objective = await Objective.findOne({ "grade": grade });
    console.log(objective);
    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    res.json(objective);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
