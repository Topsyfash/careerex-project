import express from "express"
import { handleFundsTransfer, handleGetAllTransactions, updateWalletBalance } from "../Controllers/transactionController.js"

const router = express.Router()

router.post("/update-balance", updateWalletBalance)

router.post("/send-money",handleFundsTransfer)

router.get("/all-transactions",handleGetAllTransactions)


export default router