import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Hero.css";

function Hero() {
    const navigate = useNavigate();

    return (
        <div className="hero">
            <div className="hero-overlay">
                <h1>🏡 Find Your Dream Home</h1>
                <p>Browse thousands of listings or list your property today.</p>

                {/* search */}
                <div className="hero-search">
                    <input type="text" placeholder="Search by city, address, or ZIP code..." />
                    <button onClick={() => navigate("/properties")}>Search</button>
                </div>

                {/* cll buttons */}
                <div className="hero-buttons">
                    <button className="btn-primary" onClick={() => navigate("/properties")}>Browse Properties</button>
                    <button className="btn-secondary" onClick={() => navigate("/list-property")}>List Your Property</button>
                </div>
            </div>
        </div>
    );
}

export default Hero;
