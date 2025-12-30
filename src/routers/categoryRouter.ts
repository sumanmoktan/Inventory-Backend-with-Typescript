import { createCategory, deleteCategory, DetailCategory, GetCategory, updateCategory } from '@/controller/categoryController';
import express from 'express';

const router = express.Router();

router.post("/createCategory", createCategory);
router.get("/getCategory", GetCategory);
router.get("/getCategory/:id", DetailCategory);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;

