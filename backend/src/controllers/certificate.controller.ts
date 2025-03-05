import { Request, Response } from 'express'
import { prisma } from '../server'
import {Certificate} from "../interfaces/certificate";
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../server';

const createCertificate = async (req: Request, res: Response) => {
    try {
        const certificateData = JSON.parse(req.body.certificateData);
        const { name, provider, issued_at, expires_at } = certificateData;
        const file = req.file;    
        if (!name || !provider || !issued_at || !file) {
          return res.status(400).json({ error: 'Missing required fields or file' });
        } 
        const issuedDate = new Date(issued_at);
        const expirationDate = expires_at ? new Date(expires_at) : null;  
        if (expirationDate && expirationDate <= issuedDate) {
          return res.status(400).json({ error: 'Expiration date must be after the issued date' });
        }
        const mimeType = mime.lookup(file.originalname);
        const extension = mime.extension(mimeType);
        if (!extension) {
          return res.status(400).json({ error: 'Unsupported file type' });
        }
        const uniqueFilename = `${uuidv4()}.${extension}`;
        const filePath = path.join(__dirname, '../../uploads', uniqueFilename);
        fs.renameSync(file.path, filePath);
        const newCertificate = await prisma.certificate.create({
          data: {
            name,
            provider,
            filename: uniqueFilename,
            issued_at: issuedDate,
            expires_at: expirationDate,
          },
        });   
        res.status(201).json(newCertificate);
    } catch (e: unknown) {
      if (e instanceof Error) {
        logger.error(`Error saving certificate: ${e.message}`, { stack: e.stack });
      } else {
        logger.error('An unknown error occurred', { error: e });
      }
      res.status(500).json({ error: 'Error saving certificate' });
  }
};

const getCertificates = async (req: Request, res: Response) => {
    try {
        const certificates = await prisma.certificate.findMany({
            select: {
                id: true,
                name: true,
                provider: true,
                issued_at: true,
                expires_at: true,
            },
        });
        res.status(200).json(certificates);
    }  catch (e: unknown) { 
      if (e instanceof Error) { 
          logger.error(`Error fetching certificates: ${e.message}`, { stack: e.stack });
      } else {  
          logger.error('An unknown error occurred', { error: e });
      }
      res.status(500).json({ error: e instanceof Error ? e.message : 'An unknown error occurred' });
  }
};

const downloadCertificate = async (req: Request, res: Response) => {
    try {
        const id = req.headers["certificate-id"];
    
        if (!id) {
          return res.status(400).json({ error: "Certificate ID is required in headers" });
        } 
        const certificate = await prisma.certificate.findUnique({
          where: { id: Number(id) },
          select: { filename: true, name: true },
        });   
        if (!certificate || !certificate.filename) {
          return res.status(404).json({ error: "Certificate not found" });
        } 
        const filePath = path.join(__dirname, '../../uploads', certificate.filename);
        if (!fs.existsSync(filePath)) {
          return res.status(404).json({ error: "File not found" });
        } 
        const mimeType = mime.lookup(filePath);
        const extension = mime.extension(mimeType);
        const filename = `${certificate.name}.${extension}`; 
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", mimeType);  
        return res.status(200).download(filePath);
    } catch (e: unknown) { 
      if (e instanceof Error) { 
          logger.error(`Error downloading certificate: ${e.message}`, { stack: e.stack });
      } else {    
          logger.error('An unknown error occurred', { error: e });
      }
      res.status(500).json({ error: "Error downloading file" });
  }
};

const deleteCertificate = async (req: Request, res: Response) => {
    try {
        const id = req.headers["certificate-id"];   
        if (!id) {
          return res.status(400).json({ error: "Certificate ID is required in headers" });
        }   
        const certificate = await prisma.certificate.findUnique({
          where: { id: Number(id) },
          select: { filename: true },
        }); 
        if (!certificate) {
          return res.status(404).json({ error: "Certificate not found" });
        }   
        if (certificate.filename) {
          const filePath = path.join(__dirname, '../../uploads', certificate.filename);
          await fs.unlink(filePath, (err) => {
            if (err) {
              return res.status(500).json({ error: "Error deleting certificate file" });
            }
          });
        }   
        await prisma.certificate.delete({
          where: { id: Number(id) },
        }); 
        res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (e: unknown) { 
      if (e instanceof Error) { 
          logger.error(`Error deleting certificate: ${e.message}`, { stack: e.stack });
      } else {          
          logger.error('An unknown error occurred', { error: e });
      }
      res.status(500).json({ error: "Error deleting certificate" });
  }
};

const downloadAllCertificates = async (req: Request, res: Response) => {
  try {
      const certificates = await prisma.certificate.findMany({
          select: { filename: true, name: true },
      });
      if (certificates.length === 0) {
          return res.status(404).json({ error: "No certificates found" });
      }
      const archive = archiver('zip', {
          zlib: { level: 9 },
      });
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="certificates.zip"');
      archive.pipe(res);
      for (const certificate of certificates) {
          const filePath = path.join(__dirname, '../../uploads', certificate.filename);   
          if (fs.existsSync(filePath)) {
              const mimeType = mime.lookup(filePath);
              const extension = mime.extension(mimeType);
              const filename = `${certificate.name}.${extension}`;
              archive.append(fs.createReadStream(filePath), { name: filename });
          } else {
              logger.error(`File not found: ${filePath}`);
          }
      }
      archive.finalize();
  } catch (e: unknown) {
      if (e instanceof Error) {
          logger.error(`Error creating zip file: ${e.message}`, { stack: e.stack });
      } else {
          logger.error('An unknown error occurred', { error: e });
      }
      res.status(500).json({ error: "Error generating zip file" });
  }
};


export default {
    createCertificate,
    getCertificates,
    downloadCertificate,
    deleteCertificate,
    downloadAllCertificates,
}
