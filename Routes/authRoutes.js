import express from "express"
import  {authorization, validateUserRegistration } from "../middleware/index.js"
import {  handleForgotPassword, handleRefreshToken, handleResetPassword, handleUserLogin, handleUserLogout, handleUserRegister, handleUserVerification } from "../Controllers/authController.js"

const router = express.Router()

router.post("/register", validateUserRegistration, handleUserRegister)

router.post("/login", handleUserLogin)

router.get("/verify-email", handleUserVerification)

router.post('/forgot-password', handleForgotPassword)

router.post('/reset-password', handleResetPassword)

router.get("/refresh-token", handleRefreshToken)

router.post("/logout",authorization,handleUserLogout)

export default router 