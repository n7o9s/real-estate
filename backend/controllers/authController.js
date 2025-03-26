import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// register User 
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        console.log("🔹 Signup attempt:", email, "Role:", role);

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ Email already in use:", email);
            return res.status(400).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role });

        await newUser.save();
        console.log("✅ User saved successfully:", email, "Role:", role);

        const token = generateToken(newUser);
        res.status(201).json({
            message: "✅ Signed up successfully!",
            token,
            user: { id: newUser._id, name, email, role: newUser.role }
        });
    } catch (error) {
        console.error("🚨 Error registering user:", error);
        res.status(500).json({ error: "❌ Failed to register user." });
    }
};

// login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔹 Login attempt:", email);

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Incorrect password:", email);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = generateToken(user);
        console.log("✅ Login successful:", user.email);

        res.status(200).json({
            message: "✅ Logged in successfully!",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error("🚨 Error logging in:", error);
        res.status(500).json({ error: "❌ Failed to login." });
    }
};
