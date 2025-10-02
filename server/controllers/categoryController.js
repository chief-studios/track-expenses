const Category = require("../models/categoryModel")
const { asyncHandler, ValidationError, NotFoundError } = require("../middleware/errorHandler")
const { logInfo } = require("../utils/logger")

// Create default categories
const createDefaultCategories = asyncHandler(async (userId) => {
    const defaultCategories = [
        {
            name: 'food',
            displayName: 'Food & Dining',
            description: 'Restaurants, groceries, and food-related expenses',
            icon: 'utensils',
            color: '#F59E0B',
            createdBy: userId
        },
        {
            name: 'transport',
            displayName: 'Transportation',
            description: 'Travel, fuel, public transport, and vehicle expenses',
            icon: 'car',
            color: '#3B82F6',
            createdBy: userId
        },
        {
            name: 'entertainment',
            displayName: 'Entertainment',
            description: 'Movies, games, events, and leisure activities',
            icon: 'film',
            color: '#8B5CF6',
            createdBy: userId
        },
        {
            name: 'utilities',
            displayName: 'Utilities',
            description: 'Electricity, water, internet, and utility bills',
            icon: 'zap',
            color: '#EF4444',
            createdBy: userId
        },
        {
            name: 'shopping',
            displayName: 'Shopping',
            description: 'Clothing, electronics, and general shopping',
            icon: 'shopping-bag',
            color: '#10B981',
            createdBy: userId
        }
    ]

    const existingCategories = await Category.find({ isActive: true })
    
    if (existingCategories.length === 0) {
        await Category.insertMany(defaultCategories)
        logInfo('Default categories created', { count: defaultCategories.length })
    }
})

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
        .select('-__v')
        .sort({ displayName: 1 })
    
    res.status(200).json({
        success: true,
        data: categories
    })
})

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).select('-__v')
    
    if (!category) {
        throw new NotFoundError('Category')
    }
    
    res.status(200).json({
        success: true,
        data: category
    })
})

const createCategory = asyncHandler(async (req, res) => {
    const { name, displayName, description, icon, color } = req.body
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name: name.toLowerCase() })
    if (existingCategory) {
        throw new ValidationError('Category with this name already exists', 'name')
    }
    
    const category = await Category.create({
        name: name.toLowerCase(),
        displayName,
        description,
        icon: icon || 'tag',
        color: color || '#3B82F6',
        createdBy: req.user.userId
    })
    
    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
    })
})

const updateCategory = asyncHandler(async (req, res) => {
    const { displayName, description, icon, color, isActive } = req.body
    
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            displayName,
            description,
            icon,
            color,
            isActive
        },
        { new: true, runValidators: true }
    ).select('-__v')
    
    if (!category) {
        throw new NotFoundError('Category')
    }
    
    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
    })
})

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
    )
    
    if (!category) {
        throw new NotFoundError('Category')
    }
    
    res.status(200).json({
        success: true,
        message: 'Category deactivated successfully'
    })
})

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    createDefaultCategories
}
