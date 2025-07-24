const expense = require("../models/expenseModel")

const createExpense = async (req, res) => {
    try {
        const { bill, description, date, category, amount, paymentBy, submittedBy } = req.body
        const newExpense = await new expense.create({
            bill,
            description: description || "",
            date: date || Date.now(),
            category: category,
            amount,
            paymentBy,
            submittedBy: req.user._id
        })
        await newExpense.save()
        res.status(201).json(expense)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expense.find().populate("bill").populate("submittedBy", "username")
        res.status(200).json(expenses)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getExpenseById = async (req, res) => {
    try {
        const expenseId = req.params.id
        const expense = await expense.findById(expenseId)
        if (!expense) {
            return res.status(404).json({ message: "expense not found"})
        }
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getAllExpensesForBill = async (req, res) => {
    try {
        const expenses = await expense.find({ bill: req.params.billId }).populate("bill")
        res.status(200).json(expenses)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await expense.findByIdAndUpdage(req.params.id, req.body, { new: true })
        if (!updatedExpense) {
            return res.status(404).json({ message: "expense not found" })
        }
        res.status(200).json(updatedExpense)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const deleteExpense = async (req, res) => {
    try {
        const deletedExpense = await expense.findByIdAndDelete(req.params.id)
        if (!deleteExpense) {
            return res.status(404).json({ message: "expense not found" })
        }
        res.status(200).json({ message: "expense deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    getAllExpensesForBill,
    updateExpense,
    deleteExpense
}