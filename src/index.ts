import express from "express";
 
require("dotenv").config(); // Load environment variables from a .env file into process.env
const cors = require("cors"); // Import the CORS middleware

//import ratelimit
import {rateLimit} from 'express-rate-limit'

//importing a router for url
import customerRouter from './routers/customerRouter';
import userRouter from './routers/userRouter';
import authRouter from './routers/authRouter';
import shopRouter from './routers/shopRouter';
import supplierRouter from './routers/supplierRouter';
import unitRouter from './routers/unitRouter';
import brandRouter from './routers/brandRouter';
import categoryRouter from './routers/categoryRouter';
import productRouter from './routers/productRouter';
import salesRouter from './routers/salesRouter';
import expenseCategoryRouter from "./routers/expeseCategoryRouter";
import payeeRouter from './routers/payeeRouter';
import expenseRouter from './routers/expenseRouter';


const app = express(); // Create an Express application instance

 
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
 
const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000

// Configure general rate limiter middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});
 
// Apply general rate limiter to all requests
app.use(generalLimiter);

// Configure stricter rate limiter for sensitive operations
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests, please try again later.",
    });
  },
});

// Apply stricter rate limit to sensitive routes
app.use("/api/v1/sale", strictLimiter);
app.use("/api/v1/user", strictLimiter);
app.use("/api/v1/auth", strictLimiter);

app.use(express.json()); 


//routes
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/shop", shopRouter);
app.use("/api/v1/supplier", supplierRouter);
app.use('/api/v1/unit', unitRouter);
app.use('/api/v1/brand', brandRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/sale", salesRouter);
app.use("/api/v1/expenseCategory", expenseCategoryRouter);
app.use("/api/v1/payee", payeeRouter);
app.use("/api/v1/expense", expenseRouter);



app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});