import mongoose from "mongoose"
import Wallet from "../models/walletModel.js"
import Transaction from "../models/transactionModel.js"
import User from "../models/userModel.js"
import findOneUser from "../service/index.js"

const updateWalletBalance = async (req, res) => {
    const {email,amount} = req.body
    try {
        // const { user_id, amount } = req.body
        const user = await findOneUser({ email })
        
        if (!user) {
            return res.status(400).json({message:"User Not Found"})
        }
        if (user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        if (typeof amount !== "number") {
            return res.status(400).json({message:"Amount must be a number"})
        }

        
        if (amount <= 0) {
            return res.status(400).json({ message: "Amount Must be Greater Than 0" });
        }

        const user_id = user?._id

        const userId = new mongoose.Types.ObjectId(user_id  );


        const userWallet = await Wallet.findOneAndUpdate(
            { user_id: userId },
            { $inc: { balance: amount } },
            {new:true}
        )
        
        if (!userWallet) {
            return res.status(404).json({message:"Wallet Not Found"})
        }

        await userWallet.save()

        const transaction = new Transaction({
            UserId:user_id ,
             amount,
            type:"credit",
            date:new Date()
        })

        await transaction.save()
        res.status(200).json({
            message: "Wallet balance Updated",
            userWallet,
            transaction
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

const handleFundsTransfer = async (req, res) => {
    const {senderEmail,receiverEmail,amount} = req.body
    try {
        const sender =await findOneUser({ email:senderEmail })
         const receiver = await findOneUser({ email:receiverEmail })
         
         if (!sender || !receiver) {
            return res.status(404).json({message:"Sender or Receiver not found"})
         }

         if (amount <= 0) {
            return res.status(400).json({ message: "Amount Must be Greater Than 0" });
        }

        //  res.json({ sender, receiver })
        if (sender._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
         const senderId = new mongoose.Types.ObjectId(sender?._id );
         const receiverId = new mongoose.Types.ObjectId(receiver?._id );
         

         const senderWallet = await Wallet.findOne({ user_id: senderId })
         
         const receiverWallet = await Wallet.findOne({user_id:receiverId}) 
          
         if (!senderWallet || !receiverWallet) {
            return res.status(404).json({message:"Sender or Receiver wallet not found"})
         }
 
         if (senderWallet.balance < amount) {
             return res.status(400).json({message:"Insufficient balance in sender's wallet"})
         }

         senderWallet.balance -= amount
         receiverWallet.balance += amount
         
         await senderWallet.save()
         await receiverWallet.save()
         
         const senderTransaction = new Transaction({
            UserId: senderId,
            counterpartyId: receiverId,
             amount,
            type:"debit",
            date:new Date()
        })

        const receiverTransaction = new Transaction({
            UserId: receiverId,
            counterpartyId: senderId,
             amount,
            type:"credit",
            date:new Date()
        })
        await senderTransaction.save()
        await receiverTransaction.save()
         
         res.status(200).json({
            message: 'Transfer successful.',
            senderTransaction
        }) 
     } catch (error) {
        res.status(400).json({ message: error.message });
     }
}

const handleGetUserWalletBalance = async (req,res) => {
    try {
        const wallet = await Wallet.findOne({ user_id: req.user._id })
        if (!wallet) {
            return res.status(404).json({message:"Wallet Not Found"})
        }

        res.status(200).json({
            message: "Successful",
            balance:wallet?.balance
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const handleGetPastTransactions = async (req,res) => {
    try {
        const transactions = await Transaction.find({ UserId: req.user._id })

        if (transactions.length < 0) {
            res.status().json({
                message:"No transaction found"
            })
        }
        res.status(200).json({
            Message: "Successful",
            transactions
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const handleGetAllTransactions = async (req, res) => {
    
    try {
        const allTransactions = await Transaction.find()

    if (!allTransactions) {
        return res.status(404).json({message:"No transaction found"})
    }

    res.status(200).json({
        message: "Successfull",
        allTransactions
    })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
}
export {updateWalletBalance,handleFundsTransfer,handleGetAllTransactions,handleGetUserWalletBalance,handleGetPastTransactions}
