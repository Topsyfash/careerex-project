import mongoose from "mongoose";
import Wallet from "./walletModel.js";


const transactionSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: Wallet, require: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: Wallet, require: true },
    amount: { type: Number, require: true },
    date:{type:Date,default:Date.now},
}, { timestamps: true })

const Transaction = new mongoose.model("Transaction", transactionSchema)

export default Transaction