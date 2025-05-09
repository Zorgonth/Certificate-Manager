import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import CertificateRouter from './routes/certificate.route'
import winston from 'winston'

export const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const port = 8080
export const logger = winston.createLogger({
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
            filename: process.env.NODE_ENV === 'mock' ? 'server.mock.log' : 'server.log',
            level: 'info',  
        })
    ]
})


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, certificate-id');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    next();
});

app.use('/api/v1/certificates', CertificateRouter)
app.all('*', (req: Request, res: Response) => {
    const errorMessage = `Route ${req.originalUrl} not found`
    logger.error(errorMessage)
    res.status(404).json({ error: errorMessage })
})

export async function startServer() {
    await prisma.$connect();
    const server = app.listen(port, async () => {
        console.log(`Server is listening on port ${port}`);
    });

    server.on('error', (err) => {
        logger.error(`Server error: ${err.message}`);
        process.exit(1);
    });

    process.on('uncaughtException', (error) => {
        logger.error(`Uncaught Exception: ${error.message}`);
    });

    process.on('unhandledRejection', (reason) => {
        logger.error(`Unhandled Promise Rejection: ${reason}`);
    });

    return server;
}

export default app;

if (process.env.NODE_ENV !== 'test') {
    startServer().catch(async (e) => {
        logger.error(`Error during server startup: ${e.message}`);
        await prisma.$disconnect();
        process.exit(1);
    });
}