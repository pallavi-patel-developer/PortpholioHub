const mongoose = require("mongoose");

const PostJobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Internship"], required: true },
  category: { type: String, required: true },
  experienceLevel: { type: String, enum: ["Fresher", "Intermediate", "Senior"], required: true },
  duration: { type: Number }, // in months
  location: { type: String, required: true },
  stipend: { type: String }, // could be range like "5k–10k"
  workType: { type: String, enum: ["On-site", "Remote", "Hybrid"], required: true },
  description: { type: String, required: true },
  skills: [{ type: String }], // array of skills
  deadline: { type: Date, required: true },

  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter" },

  createdAt: { type: Date, default: Date.now } , 
   recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "UserRecruiter" }, // 👈 recruiter reference
},
 { timestamps: true }
);

module.exports = mongoose.model("Job", PostJobSchema);
