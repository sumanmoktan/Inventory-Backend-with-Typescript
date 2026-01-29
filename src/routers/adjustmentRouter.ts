import { createAdjustment, GetAdjustment } from '@/controller/adjustmentsController';
import express from 'express';

const router = express.Router();

router.post("/createAdjustment", createAdjustment);
router.get("/getAdjustment", GetAdjustment);

export default router;