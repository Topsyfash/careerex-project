import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import { check, validationResult } from "express-validator"


const validateUserRegistration = [
    check("name")
      .notEmpty()
      .withMessage("User name is required"),
  
    check("email")
      .isEmail()
      .withMessage("Enter a valid email"),
  
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  
    (req, res, next) => {
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
          const messages = errors.array().map(err => err.msg)
        return res.status(400).json({ message:messages });
      }
      next();
    }
  ];
const authorization = async (req, res, next) => {
    try {
        const token = req.header("Authorization")
        if (!token) {
            return res.status(401).json({ message: "Please login!" })
        }

        const splitToken = token.split(" ")

        const realToken = splitToken[1]

        const decoded = jwt.verify(realToken, `${process.env.ACCESS_TOKEN}`)

        if (!decoded) {
            return res.status(401).json({ message: "Please login!" })
        }

        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(404).json({ message: "User account does not exist" })
        }

        req.user = user

        next()

    } catch (error) {
        res.status(404).json({message:error})
    }
}

export {validateUserRegistration,authorization}
