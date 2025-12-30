import { createBrand, deleteBrand, DetailBrand, GetBrand, updateBrand } from '@/controller/brandsController';
import express from 'express';

const router = express.Router();

router.post('/createBrand', createBrand);
router.get("/getBrand", GetBrand);
router.get("/singleBrand/:id", DetailBrand);
router.put("/updateBrand/:id", updateBrand);
router.delete("/delete/:id", deleteBrand);


export default router;