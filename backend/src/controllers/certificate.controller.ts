import { Request, Response } from 'express'
import { prisma } from '../server'
import {Certificate} from "../interfaces/certificate";

const createCertificate = async (req: Request, res: Response) => {
    try {
        const newCertificate = await prisma.certificate.create({
            data: {},
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
