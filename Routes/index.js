import express from "express"
import authRoutes from "./authRoutes.js"
import transactionRoutes from "./transactionRoutes.js"

const router = express.Router()

router.use("/auth", authRoutes)
router.use("/wallet",transactionRoutes)
export default router 