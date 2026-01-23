import { createPayee, DeletePayee, DetailOfPayee, findAllPayee, updatePayee } from '@/controller/payeeController';
import express from 'express';

const router = express.Router();

router.post("/createPayee", createPayee);
router.get("/allPayee", findAllPayee);
router.get("/detailPayee/:id", DetailOfPayee);
router.put("/updatePayee/:id", updatePayee);
router.delete("/deletePayee/:id", DeletePayee);

export default router;