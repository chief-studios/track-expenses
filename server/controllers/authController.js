const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const user = require("../models/userModel")
const { asyncHandler, ValidationError, AuthenticationError } = require("../middleware/errorHandler")

const register = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body

    const existingUser = await user.findOne({ email })
    if (existingUser) {
        throw new ValidationError('User with this email already exists', 'email')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await user.create({
        email,
        username,
        password: hashedPassword,
        role: role
    })

    const token = jwt.sign({
        userId: newUser._id,
        role: newUser.role
    },
        process.env.JWT_SECRET, 
        { expiresIn: "1h" }
    )

    res.status(201).json({
        success: true,
        message: "User created successfully",
        token,
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    })
})

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const foundUser = await user.findOne({ username })
    if (!foundUser) {
        throw new AuthenticationError('Invalid username or password')
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password)
    if (!isPasswordValid) {
        throw new AuthenticationError('Invalid username or password')
    }

    const token = jwt.sign(
        { userId: foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: foundUser._id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role
        }
    })
})

module.exports = {
    register,
    login
}