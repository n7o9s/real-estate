import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2>Welcome, {user ? user.name : "Guest"}!</h2>
            <p>Your role: {user ? user.role : "Unknown"}</p>
        </div>
    );
};

export default Dashboard;
