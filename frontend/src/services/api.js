import axios from "axios";

const API_URL = "http://localhost:5001/api";


const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

export const fetchProperties = async () => {
    try {
        const response = await api.get("/properties");
        return response.data;
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
};

export const fetchPropertyById = async (id) => {
    try {
        const response = await api.get(`/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching property details:", error);
        return null;
    }
};


export const signup = async (userData) => {
    try {
        console.log("📡 Sending signup request:", userData);
        const response = await api.post("/auth/signup", userData);
        console.log("✅ Signup successful, received response:", response.data);
        return response.data;
    } catch (error) {
        console.error("🚨 Signup Error:", error.response?.data || error);
        return { error: error.response?.data?.error || "Signup failed" };
    }
};


export const login = async (credentials) => {
    try {
        console.log("📡 Sending login request:", credentials);
        const response = await api.post("/auth/login", credentials);
        console.log("✅ Login successful, received response:", response.data);
        return response.data;
    } catch (error) {
        console.error("🚨 Error logging in:", error.response?.data || error);
        return { error: error.response?.data?.error || "Login failed" };
    }
};


export const fetchUser = async (token) => {
    try {
        const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// logout
export const logout = async () => {
    try {
        await api.post("/auth/logout");
        localStorage.removeItem("token");
    } catch (error) {
        console.error("Error logging out:", error);
    }
};
