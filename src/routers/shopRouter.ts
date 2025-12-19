import { AllShop, createShop, GetShopAttendants, ShopDetail } from '@/controller/shopController';
import express from 'express';

const router = express.Router();

// create newShop
router.post("/createShop", createShop);
//Get all Shop
router.get("/allShop", AllShop);
//get shop by attendentsIds
router.get("/attendants/shop/:id", GetShopAttendants)
//Get singleShop
router.get("/singleShop/:id", ShopDetail);

export default router;