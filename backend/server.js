const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Employee = require("./models/Employee");
const Objective = require("./models/Objective");
const SelfAppraisal = require("./models/SelfAppraisal");
const ManagerAppraisal = require("./models/ManagerAppraisal");
const ManagementAppraisal = require("./models/ManagementAppraisal");
const objectiveRoutes = require("./routes/objectiveRoutes");
//const appraisalRoutes = require( "./routes/appraisalRoutes.js");

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

//app.use("/api/appraisal", appraisalRoutes);


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
//Find all employees
app.get("/api/employees", async (req, res) => {
const employees = await Employee.find({});
return res.json(employees);

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
    const { finalData } = req.body;

    console.log("JIgyasa");
    console.log(req.body);
     
    console.log("🧹 Cleaning appraisal data for:", empId);

    // ✅ Clean and normalize selfGoals
    //const cleanedSelfGoals = (finalData?.appraisalData?.selfGoals || []).map(
 // ({ key, achievement, previousCycle, rating }) => ({
    //key,
    //achievement: Number(achievement) || 0,
    //previousCycleRating: Number(previousCycle) || 0, // 👈 map correctly
    //rating: Number(rating) || 0,
 // })
//);

    // ✅ Clean and normalize self assessment entries
    //const cleanedSelf = (finalData?.appraisalData?.self || []).map((entry) => ({
    //  assessment: entry.assessment ?? "",
     // performance: entry.performance ?? "",
     // achievements: entry.achievements ?? "",
      //developments: entry.developments ?? "",
      //training: entry.training ?? "",
    //}));


    const updatedEmployee = await Employee.findOneAndUpdate(
      { empID: empId },
      {
        $set: {
          appraisal: finalData.appraisalData, // ✅ map correctly
          submittedBy: finalData.submittedBy,
          submittedAt: finalData.submittedAt,
        },
      },
      { new: true }
    );

    if (!updatedEmployee)
      return res.status(404).json({ message: "Employee not found" });

    res.json({
      message: "✅ Appraisal updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Error updating appraisal:", error);
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

// Fetch self appraisal
app.get("/api/selfAppraisal/:empId", async (req, res) => {
 
  try {
    
    const empId = req.params.empId; // Get empId from URL
console.log(empId);
    // Find one employee where empId matches
    const selfAppraisal = await SelfAppraisal.findOne({ "empID": empId });
    console.log(selfAppraisal);
    if (!selfAppraisal) {
      return res.status(404).json({ message: "appraisal not found" });
    }

    res.json(selfAppraisal);
  } catch (err) {
    res.status(500).json({ message: "appraisal not found" });
  }
});
app.post("/api/selfAppraisal", async (req, res) => {
  try {
    const { empID } = req.body;
    const updated = await SelfAppraisal.findOneAndUpdate(
      { empID },
      req.body,
      { new: true, upsert: true } // ✅ upsert ensures update-or-create
    );
    res.json({ message: "Self Appraisal saved successfully!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save self appraisal" });
  }
});
//manger appraisal
app.get("/api/managerAppraisal/:empId", async (req, res) => {
 
  try {
    
    const empId = req.params.empId; // Get empId from URL
    console.log(empId);
    // Find one employee where empId matches
    const managerAppraisal = await ManagerAppraisal.findOne({ "empID": empId });
    console.log(managerAppraisal);
    if (!managerAppraisal) {
      return res.status(404).json({ message: "appraisal not found" });
    }

    res.json(managerAppraisal);
  } catch (err) {
    res.status(500).json({ message: "appraisal not found" });
  }
});
app.post("/api/managerAppraisal", async (req, res) => {
  try {
    const { empID } = req.body;
    const updated = await ManagerAppraisal.findOneAndUpdate(
      { empID },
      req.body,
      { new: true, upsert: true }
    );
    res.json({ message: "Manager Appraisal saved successfully!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save manager appraisal" });
  }
});


//management appraisal
app.get("/api/managementAppraisal/:empId", async (req, res) => {
 
  try {
    
    const empId = req.params.empId; // Get empId from URL
    console.log(empId);
    // Find one employee where empId matches
    const managementAppraisal = await ManagementAppraisal.findOne({ "empID": empId });
    console.log(managementAppraisal);
    if (!managementAppraisal) {
      return res.status(404).json({ message: "appraisal not found" });
    }

    res.json(managementAppraisal);
  } catch (err) {
    res.status(500).json({ message: "appraisal not found" });
  }
});
app.post("/api/managementAppraisal", async (req, res) => {
  try {
    const payload = {
      ...req.body,
      averageOverallRating: String(req.body.averageOverallRating || 0), // ensure it exists
    };

    const updated = await ManagementAppraisal.findOneAndUpdate(
      { empID: payload.empID },
      payload,
      { new: true, upsert: true }
    );

    res.json({ message: "Management Appraisal saved successfully!", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save management appraisal" });
  }
});



app.listen(5000, () => console.log("🚀 Server running on port 5000"));
