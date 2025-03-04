import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import CertificateRouter from './routes/certificate.route'
import winston from 'winston'

export const prisma = new PrismaClient()

const app = express()
const port = 8080
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',  
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: 'server.log',
            level: 'info',  
        })
    ]
})
async function main() {
    app.use(express.json())

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        next()
    })

    // Register API routes
    app.use('/api/v1/certificates', CertificateRouter)

    // Catch unregistered routes
    app.all('*', (req: Request, res: Response) => {
        const errorMessage = `Route ${req.originalUrl} not found`
        logger.error(errorMessage)
        res.status(404).json({ error: errorMessage })
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })

    process.on('uncaughtException', (error) => {
        // Handle the uncaught exception here (e.g., log it)
        logger.error(`Uncaught Exception: ${error.message}`)
    })

    process.on('unhandledRejection', (reason, promise) => {
        // Handle unhandled promise rejections here (e.g., log them)
        logger.error(`Unhandled Promise Rejection: ${reason}`)
    })
}


main()
    .then(async () => {
        await prisma.$connect()
    })
    .catch(async (e) => {
        logger.error(`Error during server startup: ${e.message}`)
        await prisma.$disconnect()
        process.exit(1)
    })
