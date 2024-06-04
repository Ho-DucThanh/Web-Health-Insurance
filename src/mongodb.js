const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb://admin:ducthanh@54.209.181.238:27017/mydatabase?directConnection=true&appName=mongosh+2.2.6";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
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

LogInSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
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
