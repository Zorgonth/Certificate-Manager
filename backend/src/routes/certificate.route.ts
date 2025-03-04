import PostController from '../controllers/certificate.controller'
import express from 'express'
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router()

router.get('/getall', PostController.getCertificates)
router.post('/create',upload.single("file"), PostController.createCertificate)
router.get('/download', PostController.downloadCertificate)
router.delete('/delete', PostController.deleteCertificate)
export default router
