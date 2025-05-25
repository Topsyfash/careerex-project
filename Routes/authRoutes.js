import express from "express"
import  {validateUserRegistration } from "../middleware/index.js"
import { handleGetAllUserInfo, handleUserLogin, handleUserRegister } from "../Controllers/authController.js"

const router = express.Router()

router.post("/register", validateUserRegistration, handleUserRegister)

router.post("/login", handleUserLogin)

router.get("/all-info", handleGetAllUserInfo)

export default router