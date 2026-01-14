import { createSales, createSalesItems, getSale } from '@/controller/salesController';
import express from  'express';

const router = express.Router();

router.post("/createSale", createSales);
router.post("/createSalesItem", createSalesItems);
router.get("/getSale", getSale); 

export default router;