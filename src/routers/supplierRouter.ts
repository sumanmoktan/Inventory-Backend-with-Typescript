import { CreateSupplier, DetailSupllier, GetAllSupplier } from '@/controller/supplierController';
import express from 'express';

const router = express.Router();

//url for create a supplier 
router.post("/createSupplier", CreateSupplier);
// finding all supplier
router.get("/getSupplier", GetAllSupplier);
//finding single supplier
router.get("/getsupplier/:id", DetailSupllier);


export default router;
