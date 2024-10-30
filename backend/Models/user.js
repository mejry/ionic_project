const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  Gouvernerat: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["Client", "employee"],
  },
  Adresse: {
    type: String,
    required: true,
  },
  codegenerated: {
    type: Number,
    default: null,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  resetCode: {
    type: Number,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
