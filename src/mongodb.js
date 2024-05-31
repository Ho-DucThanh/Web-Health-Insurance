const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Health_InSure")
  .then(() => {
    console.log("Connected successfully");
  })
  .catch((error) => {
    console.log("Connection error:", error);
  });

const LogInSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const LogInModel = mongoose.model("User", LogInSchema);

const UserSchema = mongoose.Schema({
  name: String,
  age: Number,
  sex: String,
  phone: String,
  address: String,
  type: String,
  duration: Number,
});

const UserModel = mongoose.model("KhaiBaoTT", UserSchema);

module.exports = { LogInModel, UserModel };
