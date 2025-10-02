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
const {
    validateCreateExpense,
    validateUpdateExpense,
    validateMongoId,
    validateBillId
} = require("../middleware/validation")

router.use(authenticateToken)

router.post("/", authorizeRoles("admin", "data-entry"), validateCreateExpense, createExpense)
router.get("/", authorizeRoles("admin"), getAllExpenses)
router.get("/:id", authorizeRoles("admin"), validateMongoId, getExpenseById)
router.get("/bill/:billId", authorizeRoles("admin"), validateBillId, getAllExpensesForBill)
router.put("/:id", authorizeRoles("admin", "data-entry"), validateUpdateExpense, updateExpense)
router.delete("/:id", authorizeRoles("admin"), validateMongoId, deleteExpense)

module.exports = router