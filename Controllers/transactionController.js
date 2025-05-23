import mongoose from "mongoose"
import Wallet from "../models/walletModel.js"
import Transaction from "../models/transactionModel.js"

const updateWalletBalance = async (req,res) => {
    try {
        const { user_id, amount } = req.body
        if (typeof amount !== "number") {
            return res.status(400).json({message:"Amount must be a number"})
        }

        const userWallet = await Wallet.findByIdAndUpdate(
            user_id,
            { $inc: { balance: amount } }
        )
        
        if (!userWallet) {
            return res.status(404).json({message:"Wallet Not Found",user_id})
        }

        res.status(200).json({
            message: "Wallet balance Updated",
            userWallet
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const handleFundsTransfer = async (req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const { senderId, receiverId, amount } = req.body
        
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount Must be Greater Than 0" });
        }

        const senderWallet = await Wallet.findById(senderId).session(session)

        const receiverWallet = await Wallet.findById(receiverId).session(session)

        if (!senderWallet || !receiverWallet) {
           return res.status(404).json({message:"Sender or Receiver wallet not found"})
        }

        if (senderWallet.balance < amount) {
            return res.status(400).json({message:"Insufficient balance in sender's wallet"})
        }
        senderWallet.balance -= amount
        receiverWallet.balance += amount

        await senderWallet.save({session})
        await receiverWallet.save({ session })
        

        const transaction = new Transaction({
            senderId: senderWallet?._id,
            receiverId: receiverWallet?._id,
            amount,
            date:new Date()
        })

        await transaction.save()

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({
            message: 'Transfer successful.',
            transaction
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
}


export {updateWalletBalance,handleFundsTransfer}