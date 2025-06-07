import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, require: true },
    password: { type: String, require: true },
    isVerified: { type: Boolean, default: false },
    refreshToken : {type:String,default:null}
}, { timestamps: true })

const User = new mongoose.model("User", userSchema)

export default User