const express = require('express');
const cors = require('cors');
const http = require('http');
const connectToMongo = require('./db');
const app = express();


app.set('view engine','ejs')
app.use(express.static('public'))

const PORT = process.env.PORT || 8181;


// Middleware
app.use(express.json());

// Configure CORS properly
app.use(cors({
  origin: true, // Allow the request's origin
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'email', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Global variables to track application state
let isDbConnected = false;

// Connect to MongoDB
(async () => {
  try {
    isDbConnected = await connectToMongo();
    if (isDbConnected) {
      console.log("MongoDB connection successful");
    } else {
      console.log("Server is running without MongoDB connection. Using mock data.");
    }
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.log("Server will continue running with limited functionality");
  }
})();

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err.message || "Something went wrong on the server" 
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));

// Mock API route for testing without MongoDB
app.post('/api/auth/mock/register', (req, res) => {
  const { email, name, password, phone } = req.body;
  
  // Simple validation
  if (!email || !name || !password || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  // Return a mock success response
  res.status(200).json({ 
    authtoken: "mock-auth-token-for-testing-purposes",
    message: "Mock registration successful"
  });
});

app.post('/api/auth/mock/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  
  // Return a mock success response
  res.status(200).json({ 
    authtoken: "mock-auth-token-for-testing-purposes",
    message: "Mock login successful"
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    dbConnected: isDbConnected
  });
});

app.get('/', (req, res) => {
  res.send('Healthcare API Server - Status: Running');
});



  // Start the server
app.listen(PORT, () => {
console.log(`Server is running on port http://localhost:${PORT}`);
});
