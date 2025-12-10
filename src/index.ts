import express from "express";
 
require("dotenv").config(); // Load environment variables from a .env file into process.env
const cors = require("cors"); // Import the CORS middleware

//importing a router for url
import customerRouter from './routers/customerRouter';
import userRouter from './routers/userRouter';


const app = express(); // Create an Express application instance

 
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS) for all routes
 
const PORT = process.env.PORT || 8000; // Set the server's port from environment variables or default to 8000
 
app.use(express.json()); 


//routes
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  // Start the server and listen on the specified port
  console.log(`Server is running on http://localhost:${PORT}`); // Log a message indicating the server is running
});