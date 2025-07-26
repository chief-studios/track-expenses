const bill = require("../models/billModel")
const expense = require("../models/expenseModel")

const createBill = async (req, res) => {
    try {
        const { title, descriptiton, date, createdBy } = req.body
        const newBill = await new bill.create({
            title,
            descriptiton: descriptiton || "",
            date: date || Date.now(),
            createdBy: req.user._id
        })
        await newBill.save()
        res.status(201).json(newBill)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..."})
    }
}

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
        const foundBill = await bill.find(billId).populate("createdBy", "username")
        if (!foundBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
        res.status(200).json(foundBill)
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const updateBill = async (req, res) => {
    try {
        const { billId } = req.params.id
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
        res.status(500).json({ message: "something went wrong..." })
    }
}

const deleteBill = async (req, res) => {
    try {
        const { billId } = req.params.id
        const deletedBill = await bill.findByIdAndDelete(billId)
        if (!deletedBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

const getBillWithExpenses = async (req, res) => {
    try {
        const billId = req.params.id
        const foundBill = await bill.findById(billId).poppulate("createdBy", "username")
        if(!foundBill) {
            return res.status(404).json({ message: "Bill not found" })
        }
        const expenseForBill = await expense.find({ bill: billId }).populate("paymentBy", "username")
        res.status(200).json({ bill: foundBill, expenses: expenseForBill })
    } catch (err) {
        res.status(500).json({ message: "something went wrong..." })
    }
}

module.exports = {
    createBill,
    getAllBills,
    getBillById,
    updateBill,
    deleteBill,
    getBillWithExpenses
}