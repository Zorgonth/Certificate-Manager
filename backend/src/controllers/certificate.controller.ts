import { Request, Response } from 'express'
import { prisma } from '../server'
import {Certificate} from "../interfaces/certificate";

const createCertificate = async (req: Request, res: Response) => {
    try {
        const {name, provider, filename, issued_at, expires_at } = req.body;
        if (!name || !provider || !filename || !issued_at) {
            return res.status(400).json({error: 'Missing required fields'})
        }
        
        const issuedDate = new Date(issued_at);
        const expirationDate = expires_at ? new Date(expires_at) : null;

        if (expirationDate && expirationDate <= issuedDate) {
            return res.status(400).json({ error: 'Expiration date must be after the issued date' });
        }

        const newCertificate = await prisma.certificate.create({
            data: {
                name,
                provider,
                filename,
                issued_at: new Date(issued_at),
                expires_at: expires_at ? new Date(expires_at) : null,
            },
        })

        res.status(201).json(newCertificate)
    } catch (e) {
        res.status(500).json({ error: e })
    }
}

const getCertificates = async (req: Request, res: Response) => {
    try {
        const certificates: Certificate[] = await prisma.certificate.findMany()
        res.status(200).json(certificates)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e })
    }
}

export default {
    createCertificate,
    getCertificates,
}
