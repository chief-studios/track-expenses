const express = require("express")
const { login, register } = require("../controllers/authController")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("login", login)

module.exports = router