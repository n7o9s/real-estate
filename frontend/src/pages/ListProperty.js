import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import "../styles/ListProperty.css";
import PopupMessage from "../components/PopupMessage";


const API_URL = "http://localhost:5001/api/properties";

const ListProperty = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [popup, setPopup] = useState({ visible: false, message: "", type: "" });


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        location: "",
        bedrooms: "",
        bathrooms: "",
        type: "",
    });

    // redirect if the user is NOT logged in or not a seller
    useEffect(() => {
        if (!user) {
            alert("❌ You must be logged in to list a property!");
            navigate("/login");
        } else if (user.role !== "seller") {
            alert("❌ Only sellers can list properties!");
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(formData).some((value) => value === "")) {
            setMessage("❌ Please fill in all fields.");
            return;
        }

        try {
            setLoading(true);
            console.log("📡 Sending property listing request...", formData);

            const response = await axios.post(API_URL, formData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log("✅ Property listed successfully!", response.data);

            setMessage("✅ Property listed successfully!");

            setTimeout(() => {
                navigate("/properties");
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("🚨 Error listing property:", error.response?.data || error);
            setMessage(error.response?.data?.error || "❌ Failed to list property.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="list-property-container">
            <h2>🏡 List Your Property</h2>
            {message && <p className="alert">{message}</p>}
            <form onSubmit={handleSubmit} className="property-form">
                <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />

                <div className="inline-fields">
                    <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
                    <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="inline-fields">
                    <input type="number" name="bedrooms" placeholder="Bedrooms" value={formData.bedrooms} onChange={handleChange} required />
                    <input type="number" name="bathrooms" placeholder="Bathrooms" value={formData.bathrooms} onChange={handleChange} required />
                </div>

                <select name="type" className="custom-select" value={formData.type} onChange={handleChange} required>
                    <option value="">Select Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                </select>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Listing Property..." : "🚀 List Property"}
                </button>

            </form>
        </div>
    );
};

export default ListProperty;
