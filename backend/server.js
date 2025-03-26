import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import propertyRoutes from './routes/propertyRoutes.js';
import authRoutes from './routes/authRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Connect to MongoDB Atlas
connectDB();

// ✅ Middleware
app.use(express.json()); // JSON Body Parser
// ✅ CORS Configuration (Allow Dynamic Origins)
const allowedOrigins = [
    "http://localhost:3000", // Local frontend during development
    "http://localhost:3001", // If you run it on a different port
    "https://key-nest-2e22421016ba.herokuapp.com", // Heroku frontend
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));


// ✅ Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);

// ✅ Serve static files from the React app (Frontend)
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);  // ES Module equivalent of __dirname
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    // If no API routes match, serve the React app's index.html for client-side routing
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
    });
} else {
    // For development, just serve a message when the root URL is hit
    app.get('/', (req, res) => {
        res.json({ message: '✅ Server is running!' });
    });
}


// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
