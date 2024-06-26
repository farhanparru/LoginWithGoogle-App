const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
     googleId:String,
     displayName:String,
     email:String,
     image:String,
},{timestamps:true})

const userDb = new mongoose.model("users", UserSchema)
module.exports = userDb;