import { Link, useNavigate } from "react-router-dom";
import { LogOut, CheckSquare, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-surface-200 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <CheckSquare className="w-5 h-5 text-charcoal group-hover:scale-110 transition-transform" />
                        <span className="text-lg font-semibold text-charcoal">
                            Taskflow
                        </span>
                    </Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link
                                to="/categories"
                                className="text-sm font-medium text-charcoal-muted hover:text-charcoal transition-colors hidden sm:block"
                            >
                                Categories
                            </Link>
                            <Link
                                to="/tasks/new"
                                className="btn-primary flex items-center gap-1.5 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                New Task
                            </Link>
                            <span className="text-sm text-charcoal-muted hidden sm:block">
                                {user?.username}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-charcoal-muted hover:text-charcoal transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="btn-secondary text-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary text-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
