import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to KeyNest 🏡</h1>
                <p>Find, rent, or buy your dream property with ease.</p>
                <div className="hero-buttons">
                    <Link to="/properties" className="btn-primary">Browse Properties</Link>
                    <Link to="/list-property" className="btn-secondary">List Your Property</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
