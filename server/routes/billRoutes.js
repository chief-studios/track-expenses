const express = require("express")
const {
    createBill, 
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    getBillWithExpenses,
    getBillSplit
} = require("../controllers/billController")
const { authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware")
const {
    validateCreateBill,
    validateUpdateBill,
    validateMongoId
} = require("../middleware/validation")

const router = express.Router()

router.use(authenticateToken)

router.get("/", getAllBills)
router.post("/", validateCreateBill, createBill)
router.get("/:id", validateMongoId, getBillById)
router.put("/:id", authorizeRoles("admin", "data-entry"), validateUpdateBill, updateBill)
router.delete("/:id", authorizeRoles("admin"), validateMongoId, deleteBill)
router.get("/:id/expenses", validateMongoId, getBillWithExpenses)
router.get("/:id/split", validateMongoId, getBillSplit)

module.exports = router