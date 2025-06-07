import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Wallet from "../models/walletModel.js"
import findOneUser from "../service/index.js"
import { VerifyEmail ,sendResetPasswordMail} from "../sendMail.js"


const handleUserRegister = async (req, res) => {
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
            password: hashedPassword
        })
        await user.save()


        const wallet = new Wallet({
            user_id: user?._id,
            balance: 0
        })

        await wallet.save()

        const verificationToken = jwt.sign(
            { id: user._id },
            process.env.EMAIL_VERIFICATION_TOKEN,
            { expiresIn: '10m' }
        )


        const verificationUrl = `http://localhost:8080/api/auth/verify-email?token=${verificationToken}`

        const veryfyMail = user?.email

        await VerifyEmail(veryfyMail, verificationUrl)

        res.status(201).json({
            message: "User Registered Successfully",
            user: { name, email },
            wallet
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const handleUserVerification = async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN);

        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ message: "Invalid token or ugetser not found." });


        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


const handleUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await findOneUser({ email })

        if (!user) {
            return res.status(404).json({ message: "User Account does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user?.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect email or password" })
        }

        // access Token 
        const access_token = jwt.sign(
            { id: user?._id },
            process.env.ACCESS_TOKEN,
            { expiresIn: "10m" }
        )
        // Refresh Token
        const refreshToken = jwt.sign(
            { id: user?._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: "1d" }
        )


        user.refreshToken = refreshToken
        await user.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({
            message: "Login Successfull",
            access_token,
            refreshToken,
            user: {
                id: user?._id,
                email: user?.email,
                name: user?.name,
                isVerified: user?.isVerified
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const handleRefreshToken = async (req, res) => {

    const token = req.cookies?.refreshToken;

    

    try {
        if (!token) {
        return res.status(401).json({ message: "No token provided" })
        };
        
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.ACCESS_TOKEN,
            { expiresIn: "10m" }
        );

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};


const handleForgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const token = jwt.sign(
            { id: user._id },
            process.env.RESET_PASSWORD_TOKEN,
            { expiresIn: "10m" }
        );

        const resetUrl = `http://localhost:8080/api/auth/reset-password?token=${token}`;

        await sendResetPasswordMail(user?.email, resetUrl);

        res.status(200).json({ message: "Password Reset email sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

const handleResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password required" });
        }

        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: "User not found" });

        const hashed = await bcrypt.hash(newPassword, 12);
        user.password = hashed;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const handleUserLogout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "Strict" });

        const user = await User.findById(req.user?.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { handleUserRegister, handleUserLogin, handleUserVerification, handleForgotPassword, handleResetPassword, handleRefreshToken, handleUserLogout }