const mongoose = require("mongoose")

const expenseSchema = new mongoose.Schema({
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
        required: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentBy: {
        type: String,
        required: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = mongoose.model("expense", expenseSchema)