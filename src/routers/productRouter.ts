import express from 'express';
import { createProduct, DeleteProduct, DetailProduct, GetAllProudct } from '@/controller/productController';


const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getProduct", GetAllProudct);
router.get("/detailProuduct", DetailProduct);
router.put("/updateProduct", DetailProduct);
router.delete("/deleteProduct", DeleteProduct);

export default router;
