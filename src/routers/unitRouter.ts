import express from 'express';
import { createUnit, deleteUnit, DetailUnit, GetUnit, updateUnit } from '@/controller/unitController';

const router = express.Router();

router.post("/createUnit", createUnit);
router.get("/getUnit", GetUnit);
router.get("/singleUnit/:id", DetailUnit);
router.put("/updateUnit/:id", updateUnit);
router.delete("/deleteUnit/:id", deleteUnit);

export default router;

