const express = require("express")
const router = express.Router()
const {
    createExpense,
    getAllExpenses,
    getExpenseById,
    getAllExpensesForBill,
    updateExpense,
    deleteExpense
} = require("../controllers/expensesController")
const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware")

router.use(authenticateToken)

router.post("/", authorizeRoles("admin", "data-entry"), createExpense)
router.get("/", authorizeRoles("admin"), getAllExpenses)
router.get("/:id", authorizeRoles("admin"), getExpenseById)
router.get("/bill/:billId", authorizeRoles("admin"), getAllExpensesForBill)
router.put("/:id", authorizeRoles("admin", "data-entry"), updateExpense)
router.delete("/:id", authorizeRoles("admin"), deleteExpense)

module.exports = router