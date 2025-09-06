const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  // We'll rename headline to professionalTitle for clarity
  professionalTitle: {
    type: String,
    required: true,
  },
  // Add a bio/summary section
  bio: {
    type: String,
  },
  skills: {
    type: [String],
    required: true,
  },
  // Add social media links
  social: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String }, // Add location
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false }, // Add 'current job' flag
      description: { type: String },
    },
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldofstudy: { type: String, required: true },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Profile', ProfileSchema);