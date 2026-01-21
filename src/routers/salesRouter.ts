import { createSales, createSalesItems, getSale, getShopSales, getShopsSales } from '@/controller/salesController';
import express from  'express';

const router = express.Router();

router.post("/createSale", createSales);
router.post("/createSalesItem", createSalesItems);
router.get("/getSale", getSale); 
router.get("/shopSale/:shopId", getShopSales);
router.get("/all-shop", getShopsSales);

export default router;