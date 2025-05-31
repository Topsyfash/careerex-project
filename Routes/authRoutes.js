import express from "express"
import  {authorization, validateUserRegistration } from "../middleware/index.js"
import { handleGetAllUserInfo, handleUserLogin, handleUserRegister } from "../Controllers/authController.js"

const router = express.Router()

router.post("/register", validateUserRegistration, handleUserRegister)

router.post("/login", handleUserLogin)

router.get("/all-info",authorization, handleGetAllUserInfo)

export default router 