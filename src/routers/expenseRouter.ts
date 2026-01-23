import { createExpense, DeleteExpense, detailOfExpenses, getAllExpenses, updateExpense } from '@/controller/expenseController';
import express from 'express';

const router = express.Router();

router.post("/createExpense", createExpense);
router.get("/allExpense", getAllExpenses);
router.get("/detailExpense/:id", detailOfExpenses);
router.put("/updateExpense/:id", updateExpense);
router.delete("/deleteExpense/:id", DeleteExpense);


export default router;