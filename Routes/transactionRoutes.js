import express from "express"
import { handleFundsTransfer, handleGetAllTransactions, handleGetPastTransactions, handleGetUserWalletBalance, updateWalletBalance } from "../Controllers/transactionController.js"
import { authorization } from "../middleware/index.js"

const router = express.Router()

router.post("/wallet/update-balance",authorization, updateWalletBalance)

router.post("/wallet/transfer",authorization,handleFundsTransfer)

router.get("/wallet",authorization, handleGetUserWalletBalance)

router.get("/transactions",authorization, handleGetPastTransactions)

// router.get("/all-transactions", authorization, handleGetAllTransactions)



export default router