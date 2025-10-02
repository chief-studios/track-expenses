const rateLimit = require('express-rate-limit');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        message: 'Too many login attempts, please try again later',
        retryAfter: Math.ceil(15 * 60) // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Only count failed requests
    skipSuccessfulRequests: true,
});

// Rate limiting for registration
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 registrations per hour per IP
    message: {
        message: 'Too many registration attempts, please try again later',
        retryAfter: Math.ceil(60 * 60) // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(15 * 60) // seconds
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    registerLimiter,
    apiLimiter
};
