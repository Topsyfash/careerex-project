import express from "express"
import { handleFundsTransfer, handleGetAllTransactions, updateWalletBalance } from "../Controllers/transactionController.js"
import { authorization } from "../middleware/index.js"

const router = express.Router()

router.post("/update-balance",authorization, updateWalletBalance)

router.post("/send-money",authorization,handleFundsTransfer)

router.get("/all-transactions",authorization,handleGetAllTransactions)


export default router