import express from 'express';
import { createCustomer, customer, DetailOfCustomer } from '@/controller/customerController';

const router = express.Router();


router.post('/create', createCustomer);
router.get("/customer", customer);
router.get("/customer/:id", DetailOfCustomer);

export default router;
