const mongoose = require("mongoose")

// Pre-save middleware to calculate totals
const calculateBillTotals = function () {
    if (this.contributors && this.contributors.length > 0) {
        this.totalAmount = this.contributors.reduce((sum, contributor) => {
            return sum + (contributor.amountPaid || 0)
        }, 0)
    }
}

const billSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    date: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    contributors: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: true
        },
        amountPaid: {
            type: Number,
            default: 0
        },
        amountOwed: {
            type: Number,
            default: 0
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    },
    isSettled: {
        type: Boolean,
        default: false
    }
},
    {
    timestamps: true
    })

// Add pre-save middleware
billSchema.pre('save', calculateBillTotals)
billSchema.pre('findOneAndUpdate', calculateBillTotals)

// Instance method to calculate split amounts
billSchema.methods.calculateSplit = function () {
    if (!this.contributors || this.contributors.length === 0) {
        return []
    }

    const totalPaid = this.totalAmount
    const splitAmount = totalPaid / this.contributors.length

    return this.contributors.map(contributor => ({
        name: contributor.name,
        paid: contributor.amountPaid,
        owes: splitAmount,
        balance: contributor.amountPaid - splitAmount
    }))
}

// Static method to get bill summary
billSchema.statics.getBillSummary = async function (billId) {
    const bill = await this.findById(billId)
        .populate('createdBy', 'username email')
        .populate('contributors.user', 'username email')

    if (!bill) return null

    const expenses = await mongoose.model('expense').find({ bill: billId })
        .populate('category', 'displayName color')
        .populate('submittedBy', 'username')

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const split = bill.calculateSplit()

    return {
        bill,
        expenses,
        totalExpenses,
        split,
        isBalanced: Math.abs(totalExpenses - bill.totalAmount) < 0.01
    }
}

module.exports = mongoose.model("bill", billSchema)