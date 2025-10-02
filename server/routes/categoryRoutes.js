const express = require("express")
const {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController")
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware")
const { validateMongoId } = require("../middleware/validation")

const router = express.Router()

router.use(authenticateToken)

router.get("/", getAllCategories)
router.get("/:id", validateMongoId, getCategoryById)
router.post("/", authorizeRoles("admin"), createCategory)
router.put("/:id", authorizeRoles("admin"), validateMongoId, updateCategory)
router.delete("/:id", authorizeRoles("admin"), validateMongoId, deleteCategory)

module.exports = router
