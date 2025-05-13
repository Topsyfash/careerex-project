import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"    
import bcrypt  from "bcryptjs"
import jwt from "jsonwebtoken"   
import User from "./userModel.js"
import Wallet from "./walletModel.js"

dotenv.config()


const app = express()

app.use(express.json())

const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
});


app.post("/register",async (req,res) => {
    try {
        const { name, email, password } = req.body
        
        if (!email) {
            return res.status(400).json({ message: "Please Add your email" })
        }
        if (!password) {
            return res.status(400).json({ message: "Please enter password" })
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "User already exist" })
        }

        if (password.length < 8) {   
            return res.status(400).json({ message: "Password should not be less than 8" })
        }


        const hashedPassword = await bcrypt.hash(password, 12)
        
        const user = new User({
            name,
            email,
            password:hashedPassword
        })
        await user.save()


        const wallet = new Wallet({
            user_id: user?._id,
            balance:0
        })

        await wallet.save()

        res.status(201).json({
            message: "User Registered Successfully",
            user: { name, email },
            wallet
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

app.post("/login",async (req,res) => {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(404).json({message:"User Account does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user?.password)

        if (!isMatch) {
            return res.status(400).json({message:"Incorrect email or password"})
        }

        // access Token 
        const access_token = jwt.sign(
            {id:user?._id},
            process.env.ACCESS_TOKEN,
            {expiresIn:"10m"}
        )
        // Refresh Token
        const refreshToken = jwt.sign(
            {id:user?._id},
            process.env.REFRESH_TOKEN,
            {expiresIn:"1d"}
        )

        res.status(200).json({
            message: "Login Successfull",
            access_token,
            refreshToken,
            user: {
                email: user?.email,
                name:user?.name
            }
        })
    } catch (error) {
        
    }
})