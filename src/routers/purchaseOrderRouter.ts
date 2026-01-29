import { createPurchaseOrder, GetPurchaseOrders } from '@/controller/purchaseOrder';
import express from 'express';

const router = express.Router();

router.post("/createPurchaseOrder", createPurchaseOrder);
router.get("/getAllPucharchaseOrder", GetPurchaseOrders);

export default router;
