import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"    
import { handleGetAllUserInfo, handleUserLogin, handleUserRegister } from "./Controllers/authController.js"
import { handleFundsTransfer,  handleGetAllTransactions,  updateWalletBalance } from "./Controllers/transactionController.js"
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

app.get("/all-info",handleGetAllUserInfo)


app.get("/all-transactions",handleGetAllTransactions)
