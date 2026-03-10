import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register, loading, error, clearError } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();
        const success = await register(username, email, password);
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
                        Create an account
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
                                placeholder="Choose a username"
                                minLength={3}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                placeholder="you@example.com"
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
                                placeholder="At least 6 characters"
                                minLength={6}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-charcoal-muted">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-charcoal font-medium hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
