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
        type: String,
        required: true,
        enum: ["tv", "stand", "transport"]
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
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