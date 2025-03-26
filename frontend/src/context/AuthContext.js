import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";

const API_URL = "http://localhost:5001/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // get ussers
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (response.data) {
                setUser(response.data);
            } else {
                logout();
            }
        } catch (error) {
            console.error("🚨 Error fetching user:", error.response?.data || error);
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });

            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
            } else {
                throw new Error("Token missing in response!");
            }
        } catch (error) {
            console.error("🚨 Login error:", error.response?.data || error);
            return error.response?.data || { error: "Failed to login" };
        }
    };

    // signup 
    const signup = async (name, email, password, role) => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password, role });

            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
            } else {
                throw new Error("Token missing in response!");
            }
        } catch (error) {
            console.error("🚨 Signup error:", error.response?.data || error);
            return error.response?.data || { error: "Failed to register" };
        }
    };

    // logout
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        alert("✅ Successfully signed out!");
        window.location.href = "/login";

    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
