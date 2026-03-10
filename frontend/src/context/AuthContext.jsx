import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAuthenticated = !!token;

    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await loginUser({ username, password });
            const { access_token } = response.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify({ username }));

            setToken(access_token);
            setUser({ username });

            return true;

        } catch (err) {
            setError(err.response?.data?.detail || "Login failed");
            return false;

        } finally {
            setLoading(false);
        }
    };

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);

        try {
            await registerUser({ username, email, password });
            return await login(username, password);

        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
            return false;

        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const clearError = () => setError(null);

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
