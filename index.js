import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"   
import cors from "cors" 
import routes from "./Routes/index.js"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

const PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    });
});

  
app.use("/api",routes)

app.get("/",async (req,res) => {
  res.status(200).json({
    message:"Welcome to CareerEx Project Backend"
  })
})