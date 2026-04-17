import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },

    personal: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    education: [
      {
        degree: { type: String, default: "" },
        institution: { type: String, default: "" },
        year: { type: String, default: "" },
        cgpa: { type: String, default: "" },
        _id: false,
      },
    ],

    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        duration: { type: String, default: "" },
        description: { type: String, default: "" },
        _id: false,
      },
    ],

    projects: [
      {
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        techStack: { type: String, default: "" },
        link: { type: String, default: "" },
        _id: false,
      },
    ],

    skills: {
      languages: { type: String, default: "" },
      frameworks: { type: String, default: "" },
      tools: { type: String, default: "" },
      databases: { type: String, default: "" },
      others: { type: String, default: "" },
    },

    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        year: { type: String, default: "" },
        _id: false,
      },
    ],

    achievements: { type: String, default: "" },

    template: {
      type: String,
      enum: ["modern", "classic", "minimal"],
      default: "modern",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
