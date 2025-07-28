const express = require("express")
const {
    createBill, 
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    getBillWithExpenses
} = require("../controllers/billController")
const { authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware")

const router = express.Router()

router.use(authenticateToken)

router.get("/", getAllBills)
router.post("/", createBill)
router.get("/:id", getBillById)
router.put("/:id", authorizeRoles("admin", "data-entry"), updateBill)
router.delete("/:id", authorizeRoles(["admin"]), deleteBill)
router.get("/:id/expenses", getBillWithExpenses)

module.exports = router