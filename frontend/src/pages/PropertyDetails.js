import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import "../styles/PropertyDetails.css";

const API_URL = "http://localhost:5001/api/properties";

const PropertyDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchPropertyDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                setProperty(response.data);
            } catch (error) {
                console.error("Error fetching property details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPropertyDetails();
    }, [id]);

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setErrorMessage("You must be logged in to send an inquiry.");
            return;
        }

        try {
            await axios.post(`${API_URL}/${id}/inquiry`, { message }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            setSuccessMessage("Inquiry sent successfully!");
            setErrorMessage("");
            setMessage("");
        } catch (error) {
            setErrorMessage("Failed to send inquiry.");
            setSuccessMessage("");
        }
    };

    if (loading) return <p className="loading">Loading property details...</p>;
    if (!property) return <p className="error-text">Property not found.</p>;

    return (
        <div className="property-details">
            <h2>{property.title}</h2>
            <img src={property.image || "/assets/default-house.jpg"} alt={property.title} />
            <p className="property-price"><strong>💰 Price:</strong> ${property.price.toLocaleString()}</p>
            <p className="property-location"><strong>📍 Location:</strong> {property.location}</p>
            <p className="property-features">🛏 {property.bedrooms} Beds | 🛁 {property.bathrooms} Baths</p>
            <p className="property-description">{property.description}</p>

            {/* Inquiry Form */}
            <div className="inquiry-form">
                <h3>Send an Inquiry</h3>
                <form onSubmit={handleInquirySubmit}>
                    <textarea
                        placeholder="Ask a question about this property..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                    <button type="submit" className="contact-btn">Send Inquiry</button>
                </form>
                {successMessage && <p className="success-text">{successMessage}</p>}
                {errorMessage && <p className="error-text">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default PropertyDetails;
