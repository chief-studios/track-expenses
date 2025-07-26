const express = require("express")
const {
    createBill, 
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    getBillWithExpenses
} = require("../controllers/billController")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")

const router = express.Router()

router.use(authenticateToken)

router.get("/", getAllBills)
router.post("/", createBill)

module.exports = router