const bill = require("../models/billModel")

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