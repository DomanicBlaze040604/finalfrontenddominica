// Add this to your app.js file in your Railway backend
// This should be added BEFORE your routes

import cors from 'cors';

// CORS Configuration for Dominica News
const corsOptions = {
  origin: [
    // Development
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    
    // Production
    'https://dominicanews.dm',
    'https://www.dominicanews.dm',
    
    // Vercel deployments
    'https://your-project.vercel.app',
    'https://your-project-git-main.vercel.app',
    
    // Add any other domains you use
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Forwarded-For',
    'X-Real-IP'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Add this middleware to log CORS requests (for debugging)
app.use((req, res, next) => {
  console.log(`CORS Request: ${req.method} ${req.url} from ${req.get('Origin')}`);
  next();
});

// Your existing routes go here...