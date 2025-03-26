import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";
import PopupMessage from "../components/PopupMessage";

const API_URL = "http://localhost:5001/api/auth/signup";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "buyer",
    });

    const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData);
            localStorage.setItem("token", response.data.token);

            setPopup({ visible: true, message: "✅ Signed up successfully!", type: "success" });

            setTimeout(() => {
                setPopup({ ...popup, visible: false });
                navigate("/dashboard");
                window.location.reload();
            }, 1500);
        } catch (error) {
            setPopup({
                visible: true,
                message: error.response?.data?.error || "❌ Signup failed",
                type: "error",
            });

            setTimeout(() => setPopup({ ...popup, visible: false }), 3000);
        }
    };

    return (
        <div className="signup-container">
            <PopupMessage {...popup} /> {/* popup */}

            <div className="signup-box">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                    </select>
                    <button type="submit" className="signup-btn">Sign Up</button>
                </form>
                <p className="switch-auth">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
