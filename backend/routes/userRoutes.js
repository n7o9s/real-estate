import express from "express";
import authenticate from "../middleware/authenticate.js";
import User from "../models/userModel.js";

const router = express.Router();

// get user urofile route ( Authentication)
router.get("/:userId", authenticate, async (req, res) => {
    try {
        const { userId } = req.params;

        // detch user from database
        const user = await User.findById(userId).select("-password"); //exxclude password field
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
