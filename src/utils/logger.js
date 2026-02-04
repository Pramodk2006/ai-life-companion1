const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.CLOUD_MODE === 'true';

// Only try to create logs directory if not in serverless environment
let logsDir = null;
if (!isServerless) {
    try {
        logsDir = path.join(__dirname, '..', '..', 'logs');
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    } catch (error) {
        // If we can't create logs directory, just log to console
        console.warn('Could not create logs directory, using console only:', error.message);
        logsDir = null;
    }
}

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
            return `${timestamp} ${level}: ${message} ${metaStr}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        // Only add file transports if not in serverless environment and logs directory exists
        ...(logsDir ? [
            new winston.transports.File({ 
                filename: path.join(logsDir, 'error.log'), 
                level: 'error' 
            }),
            new winston.transports.File({ 
                filename: path.join(logsDir, 'combined.log') 
            })
        ] : [])
    ]
});

module.exports = logger;