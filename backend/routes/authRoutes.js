import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import User from "../models/userModel.js";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);


router.get("/me", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("🚨 Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user data." });
    }
});

export default router;
