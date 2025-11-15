import { generateToken } from '../../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import User from '../modals/user.modal.js'
import bcrypt from 'bcryptjs';
import 'dotenv/config'


export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            res.status(400).json({ message: "password must be 6 character long" })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "Invalid email format" })
        }

        const user = await User.findOne({ email })
        if (user) {
            res.status(400).json({ message: "Email already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ fullName, email, password: hashedPassword })

        if (newUser) {
            // generateToken(newUser._id, res)
            // await newUser.save();

            const savedUser = await newUser.save();
            generateToken(savedUser._id, res)

            res.status(201).json({ _id: newUser._id, fullName: newUser.fullName, email: newUser.email  , profilePic: newUser.profilePic })

            try {
                await sendWelcomeEmail(savedUser.email,savedUser.fullName,process.env.CLIENT_URL)
            } catch (error) {
                console.error("Failed to send welcome email",error)
            }
        } else {
            res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log("Error in sign up controller", error);
        res.status(500).json({ message: "interval server error" })
    }
}
