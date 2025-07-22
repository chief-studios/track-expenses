const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")

require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)

app.get("/testing", (req, res) => {
    res.send("app is online")
})

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected to mongodb")
        app.listen(port, () => console.log("server running"))
    })
    .catch(err => console.log(err.message))