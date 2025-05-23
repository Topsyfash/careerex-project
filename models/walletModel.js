import mongoose from "mongoose";
import User from "./userModel.js";

const walletSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId ,ref:User, require:true},
    balance: { type: Number, default: 0 },
}, { timestamps: true })

const Wallet = new mongoose.model("Wallet", walletSchema)

export default Wallet