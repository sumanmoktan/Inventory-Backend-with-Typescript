import express from 'express';
import { createProduct, DeleteProduct, DetailProduct, GetAllProudct, UpdateProduct } from '@/controller/productController';


const router = express.Router();

router.post("/createProduct", createProduct);
router.get("/getProduct", GetAllProudct);
router.get("/detailProuduct/:id", DetailProduct);
router.put("/updateProduct/:id", UpdateProduct);
router.delete("/deleteProduct/:id", DeleteProduct);

export default router;
