const mongoose = require("mongoose")
const  Schema = mongoose.Schema;
const userSchema = new Schema({
  name: String,
  userName: String,
  password: String,
  passs: Array
})
const User = mongoose.model("password_app", userSchema)
module.exports = User