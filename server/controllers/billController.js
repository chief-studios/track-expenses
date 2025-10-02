const bill = require("../models/billModel")
const expense = require("../models/expenseModel.js")
const { asyncHandler, ValidationError, NotFoundError } = require("../middleware/errorHandler")
const { logInfo } = require("../utils/logger")

const createBill = asyncHandler(async (req, res) => {
    const { title, description, date, contributors } = req.body

    const newBill = await bill.create({
        title,
        description: description || "",
        date: date || Date.now(),
        createdBy: req.user.userId,
        contributors: contributors || []
    })

    await newBill.populate('createdBy', 'username email')

    logInfo('New bill created', {
        billId: newBill._id,
        title: newBill.title,
        createdBy: req.user.userId
    })

    res.status(201).json({
        success: true,
        message: 'Bill created successfully',
        data: newBill
    })
})

const getAllBills = async (req, res) => {
    try {
        const bills = await bill.find().populate("createdBy", "username")
        res.status(200).json(bills)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getBillById = async (req, res) => {
    try {
        const billId = req.params.id
        const foundBill = await bill.find({ _id: billId }).populate("createdBy", "username")
        if (!foundBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
        res.status(200).json(foundBill)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "something went wrong..." })
    }
}

const updateBill = async (req, res) => {
    try {
        const billId = req.params.id
        const { title, description, date } = req.body
        const updatedBill = await bill.findByIdAndUpdate(
            billId,
            {
                title, 
                description: description || "",
                date
            },
            { new: true }
        )
        if (!updatedBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
        res.status(200).json(updatedBill)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: "something went wrong..." })
    }
}

const deleteBill = async (req, res) => {
    try {
        const billId = req.params.id
        const deletedBill = await bill.findByIdAndDelete(billId)
        if (!deletedBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
        res.status(200).json({ message: "Bill deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getBillWithExpenses = asyncHandler(async (req, res) => {
    const billSummary = await bill.getBillSummary(req.params.id)

    if (!billSummary) {
        throw new NotFoundError('Bill')
    }

    res.status(200).json({
        success: true,
        data: billSummary
    })
})

const getBillSplit = asyncHandler(async (req, res) => {
    const foundBill = await bill.findById(req.params.id)
        .populate('createdBy', 'username email')
        .populate('contributors.user', 'username email')

    if (!foundBill) {
        throw new NotFoundError('Bill')
    }

    const expenses = await expense.find({ bill: req.params.id })
        .populate('category', 'displayName color')
        .populate('submittedBy', 'username')

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const split = foundBill.calculateSplit()

    res.status(200).json({
        success: true,
        data: {
            bill: foundBill,
            totalExpenses,
            split,
            expenses,
            isBalanced: Math.abs(totalExpenses - foundBill.totalAmount) < 0.01
        }
    })
})

module.exports = {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    getBillWithExpenses,
    getBillSplit
}