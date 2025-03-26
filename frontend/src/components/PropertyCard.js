import React from "react";
import { Link } from "react-router-dom";
import "../styles/PropertyCard.css";

const PropertyCard = ({ property }) => {
    return (
        <div className="property-card">
            <img src={property.image || "/assets/default-house.jpg"} alt={property.title} className="property-image" />
            <div className="property-details">
                <h3>{property.title}</h3>
                <p className="property-location">{property.location}</p>
                <p className="property-price">${property.price.toLocaleString()}</p>
                <p className="property-type">{property.type}</p>
                <Link to={`/properties/${property.id}`} className="btn btn-primary">View Details</Link>
            </div>
        </div>
    );
};

export default PropertyCard;
