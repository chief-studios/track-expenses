const mongoose = require("mongoose")

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
        member: String,
        amoundPaid: Number
    }]
},
    {
    timestamps: true
    })

const Bill = mongoose.model("bill", billSchema)