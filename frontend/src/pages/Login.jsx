import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const success = await login(username, password);
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <CheckSquare className="w-6 h-6 text-charcoal" />
                    <span className="text-xl font-bold text-charcoal">Taskflow</span>
                </div>

                <div className="card">
                    <h2 className="text-lg font-semibold text-charcoal mb-5">
                        Welcome back
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="label">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-charcoal-muted">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-charcoal font-medium hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
