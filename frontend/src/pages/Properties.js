import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/properties.css";

const API_URL = "http://localhost:5001/api/properties";

const Properties = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get(API_URL);
                setProperties(response.data);
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };
        fetchProperties();
    }, []);

    return (
        <div className="properties-container">
            <h1 className="section-title">Available Properties</h1>
            <div className="property-grid">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div key={property._id} className="property-card">
                            <img
                                src={property.image || "/assets/default-house.jpg"}
                                alt={property.title}
                            />
                            <div className="content">
                                <h2 className="title">{property.title}</h2>
                                <p className="location">📍 {property.location}</p>
                                <p className="price">💰 ${property.price.toLocaleString()}</p>
                                <p>🛏 {property.bedrooms} Beds | 🛁 {property.bathrooms} Baths</p>
                                <Link to={`/properties/${property._id}`} className="view-btn">View Details</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="loading">Loading properties...</p>
                )}
            </div>
        </div>
    );
};

export default Properties;
