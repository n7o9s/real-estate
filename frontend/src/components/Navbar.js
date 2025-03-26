import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            {/* logo */}
            <Link to="/" className="logo">
                Key<span className="logo-highlight">Nest</span>
            </Link>

            {/* nav links*/}
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/properties">Properties</Link></li>
                {user?.role === "seller" && (
                    <li><Link to="/list-property">List Property</Link></li>
                )}
            </ul>

            {/*auth */}
            <div className="auth-section">
                {user ? (
                    <>
                        <span className="welcome-text">Hello, {user.name}!</span>
                        <button className="logout-btn" onClick={logout}>Sign Out</button>
                    </>
                ) : (
                    <Link to="/login" className="login-btn">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
