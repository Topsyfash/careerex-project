import express from "express"
import { handleFundsTransfer, handleGetAllTransactions, handleGetPastTransactions, handleGetUserWalletBalance, updateWalletBalance } from "../Controllers/transactionController.js"
import { authorization } from "../middleware/index.js"

const router = express.Router()

router.post("/update-balance",authorization, updateWalletBalance)

router.post("/send-money",authorization,handleFundsTransfer)

router.get("/wallet-balance",authorization, handleGetUserWalletBalance)

router.get("/transactions",authorization, handleGetPastTransactions)

router.get("/all-transactions", authorization, handleGetAllTransactions)



export default router