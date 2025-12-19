import { createCategory, deleteCategory, DetailCategory, GetCategory, updateCategory } from '@/controller/categoryController';
import express from 'express';

const router = express.Router();

router.post("/createCategory", createCategory);
router.get("/category", GetCategory);
router.get("/category/:id", DetailCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

export default router;

