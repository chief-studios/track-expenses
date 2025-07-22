const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const user = require("../models/userModel")

const register = async (req, res) => {
    try {
        const { email, username, password, role } = req.body
        const existingUser = await user.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" })
        }
        const hashePassword = await bcrypt.hash(password, 10)
        const newUser = new user.create({
            email,
            username,
            password: hashePassword,
            role: role
        })
        res.status(201).json({ message: "user created successfully", user: newUser})
    } catch (err) {
        res.status(500).json({ message: "something went wrong..."})
    }
}

const login = async (req, res) => {
    try { 
        const { username, password } = req.body
        const user = await user.findOne({ username })
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({
            message: "login successful",
            token,
            user: {
                id: user._id, 
                name: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

module.exports = {
    register,
    login
}