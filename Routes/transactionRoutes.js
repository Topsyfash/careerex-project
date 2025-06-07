import express from "express"
import { handleFundsTransfer, handleGetAllTransactions, handleGetPastTransactions, handleGetUserWalletBalance, updateWalletBalance } from "../Controllers/transactionController.js"
import { authorization } from "../middleware/index.js"

const router = express.Router()

router.post("/update-balance",authorization, updateWalletBalance)

router.post("/transfer",authorization,handleFundsTransfer)

router.get("/",authorization, handleGetUserWalletBalance)

router.get("/transactions",authorization, handleGetPastTransactions)

export default router