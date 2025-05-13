import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    user_id: { type: String ,require:true},
    balance: { type: Number, default: 0 },
}, { timestamps: true })

const Wallet = new mongoose.model("Wallet", walletSchema)

export default Wallet