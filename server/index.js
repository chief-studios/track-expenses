const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const helmet = require("helmet")

require("dotenv").config()

// Import configuration
const { validateEnv, getConfig } = require('./config/env')
const { connectDB } = require('./config/database')
const { authenticateToken, authorizeRoles } = require("./middleware/authMiddleware")
const { apiLimiter } = require("./middleware/security")
const { errorHandler } = require("./middleware/errorHandler")
const { httpLogger, logInfo, logError } = require("./utils/logger")
const { swaggerUi, specs } = require('./config/swagger')
const authRoutes = require("./routes/authRoutes")
const expensesRoutes = require("./routes/expensesRoutes")
const billRoutes = require("./routes/billRoutes")
const categoryRoutes = require("./routes/categoryRoutes")

// Validate environment variables
validateEnv()
const config = getConfig()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// HTTP request logging
app.use(httpLogger)

// Apply rate limiting to all routes
app.use(apiLimiter)

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Expense Tracker API Documentation'
}))

// API Routes
app.use("/auth", authRoutes)
app.use("/expenses", expensesRoutes)
app.use("/bills", billRoutes)
app.use("/categories", categoryRoutes)

app.get("/testing", (req, res) => {
    res.json({ message: "app is online", timestamp: new Date().toISOString() })
})

// Global error handler (must be last middleware)
app.use(errorHandler)

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB()

        // Start HTTP server
        app.listen(config.port, () => {
            logInfo(`Server started successfully`, {
                port: config.port,
                environment: config.nodeEnv,
                timestamp: new Date().toISOString(),
                logLevel: config.logLevel
            })
        })
    } catch (error) {
        logError("Failed to start server", error)
        process.exit(1)
    }
}

startServer()