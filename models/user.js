const mongoose = require('mongoose'); // Import mongoose to define the schema for the User model

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email is unique
    lowercase: true,
  },
  password: { 
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: null, // Default to null if not provided
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema); // Export the User model based on the userSchema
