// for future updates
import React, { useEffect, useState } from "react";
import { fetchProperties } from "../services/api.js";
import { useNavigate } from "react-router-dom";
import "../styles/FeaturedProperties.css";

function FeaturedProperties() {
    const [properties, setProperties] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getProperties = async () => {
            const data = await fetchProperties();
            setProperties(data.slice(0, 4));
        };
        getProperties();
    }, []);

    return (
        <div className="featured">
            <h2>🔥 Featured Listings</h2>
            <div className="property-grid">
                {properties.map((property) => (
                    <div key={property._id} className="property-card" onClick={() => navigate(`/properties/${property._id}`)}>
                        <img src={property.images?.[0] || "/default-house.jpg"} alt="Property" />
                        <div className="property-info">
                            <h3>{property.title}</h3>
                            <p>📍 {property.location}</p>
                            <p>💰 ${property.price}</p>
                            <p>{property.bedrooms} Beds • {property.bathrooms} Baths</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="view-all-btn" onClick={() => navigate("/properties")}>View All Properties</button>
        </div>
    );
}

export default FeaturedProperties;
