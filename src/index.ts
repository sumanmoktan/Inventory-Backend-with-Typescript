import express from "express";
 
require("dotenv").config(); // Load environment variables from a .env file into process.env
const cors = require("cors"); // Import the CORS middleware

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


const app = express(); // Create an Express application instance

 
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
 
const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000
 
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

app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});