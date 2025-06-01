import express from "express"
import  {authorization, validateUserRegistration } from "../middleware/index.js"
import { handleGetAllUserInfo, handleUserLogin, handleUserRegister } from "../Controllers/authController.js"

const router = express.Router()

router.post("/auth/register", validateUserRegistration, handleUserRegister)

router.post("/auth/login", handleUserLogin)

// router.get("/all-info",authorization, handleGetAllUserInfo)

export default router 