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
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await user.create({
            email,
            username,
            password: hashedPassword,
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
        const foundUser = await user.findOne({ username })
        if (!foundUser) {
            return res.status(404).json({ message: "user not found" })
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid credentials" })
        }
        const token = jwt.sign(
            { userId: foundUser._id, role: foundUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )
        res.status(200).json({
            message: "login successful",
            token,
            user: {
                id: foundUser._id, 
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role
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