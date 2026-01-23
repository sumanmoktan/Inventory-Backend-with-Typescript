import { createExpenseCategory, DeleteCategory, DetailOfCategory, findAllCatgory, updateExpenseCategory } from '@/controller/expensesCategoryController';
import express from 'express';

const router = express.Router();

router.post("/createExpCategory", createExpenseCategory);
router.get("/AllExpCategory", findAllCatgory);
router.get("/detailExpCate/:id", DetailOfCategory);
router.put("/updateExpCate/:id", updateExpenseCategory);
router.delete("/deleteExpCate/:id", DeleteCategory);


export default router;