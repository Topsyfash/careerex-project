import mongoose from "mongoose";
import User from "./userModel.js";


const transactionSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: User, required: true },
    counterpartyId: { type: mongoose.Schema.Types.ObjectId, ref: User},
    amount: { type: Number, required: true },
    type:{type:String,enum:["credit","debit"],required:true},
    date:{type:Date,default:Date.now},
}, { timestamps: true })

const Transaction = new mongoose.model("Transaction", transactionSchema)

export default Transaction