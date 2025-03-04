import PostController from '../controllers/certificate.controller'
import express from 'express'

const router = express.Router()

router.get('/getall', PostController.getCertificates)
router.post('/create', PostController.createCertificate)

export default router
