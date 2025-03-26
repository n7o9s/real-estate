import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "❌ Unauthorized - No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) return res.status(401).json({ error: "❌ Unauthorized - Invalid user" });

        next();
    } catch (error) {
        console.error("🚨 Token verification failed:", error);
        return res.status(401).json({ error: "❌ Invalid token" });
    }
};
