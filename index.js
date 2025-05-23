import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"    
import bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"   
import User from "./models/userModel.js"
import Wallet from "./models/walletModel.js"
import { handleUserLogin, handleUserRegister } from "./Controllers/authController.js"
import { handleFundsTransfer, updateWalletBalance } from "./Controllers/transactionController.js"
import { validateUserRegistration } from "./middleware/index.js"

dotenv.config()


const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
});


app.post("/register",validateUserRegistration, handleUserRegister)
 
app.post("/login",handleUserLogin)

app.post("/update-balance", updateWalletBalance)

app.post("/send-money",handleFundsTransfer)

app.get("/all-info",async (req,res) => {
 try {
     const users = await User.find()
     
     const wallets = await Wallet.find()

     if (!users) {
        return res.status(404).json({message:"User Account does not exist"})
    }

    if (!wallets) {
        return res.status(404).json({message:"Wallet Account does not exist"})
    }
     res.status(200).json({
         message: "successfull",
         users,
         wallets
     })
     
 } catch (error) {
   res.status(500).json({ message: error.message })
 }     
})

// app.get("/balance", async (req, res) => {
//     const {id} = req.body
//     const balance = await Wallet.findById(id)
//     const bal = balance?.user_id
//     if (!balance) {
//         return res.status(404).json({message:"Wallet not found"})
//     }
//     res.status(200).json({
//         message: "successfull",
//         balance: balance,
//         bal
//     })
// })
