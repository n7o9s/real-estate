import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Connect to MongoDB Atlas
connectDB();

// ✅ CORS Configuration (Allow Dynamic Origins)
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
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

// ✅ Middleware
app.use(express.json()); // JSON Body Parser

// ✅ Routes
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);

// ✅ Root Route
app.get("/", (req, res) => {
    res.json({ message: "✅ Server is running!" });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
