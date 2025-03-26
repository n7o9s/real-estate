import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api.js";
import "../styles/Login.css";
import PopupMessage from "../components/PopupMessage";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            if (response.error) {
                setPopup({
                    visible: true,
                    message: `❌ ${response.error}`,
                    type: "error",
                });
            } else {
                localStorage.setItem("token", response.token);
                setPopup({
                    visible: true,
                    message: "✅ Logged in successfully!",
                    type: "success",
                });
                setTimeout(() => {
                    setPopup({ ...popup, visible: false });
                    navigate("/");
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            setPopup({
                visible: true,
                message: "❌ Login failed",
                type: "error",
            });
            setTimeout(() => setPopup({ ...popup, visible: false }), 3000);
        }
    };

    return (
        <div className="login-container">
            <PopupMessage {...popup} /> {/* popup */}
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="login-btn">Login</button>
                </form>
                <p className="switch-auth">
                    Don't have an account? <a href="/signup">Sign up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
