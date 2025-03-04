import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import CertificateRouter from './routes/certificate.route'

export const prisma = new PrismaClient()

const app = express()
const port = 8080

async function main() {
    app.use(express.json())

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*')
        next()
    })

    // Register API routes
    app.use('/api/v1/certificates', CertificateRouter)

    // Catch unregistered routes
    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({ error: `Route ${req.originalUrl} not found` })
    })

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`)
    })

    process.on('uncaughtException', (error) => {
        // Handle the uncaught exception here (e.g., log it)
        console.error('Uncaught Exception:', error)
    })

    process.on('unhandledRejection', (reason, promise) => {
        // Handle unhandled promise rejections here (e.g., log them)
        console.error('Unhandled Promise Rejection:', reason)
    })
}

main()
    .then(async () => {
        await prisma.$connect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
