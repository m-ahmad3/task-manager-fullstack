import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";
import TaskForm from "../components/TaskForm";
import {createTask, getCategories} from "../services/api";

export default function CreateTask() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data);
            } catch (err) {
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await createTask(data);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
            </Link>

            <h1 className="text-2xl font-bold text-charcoal mb-6">Create Task</h1>
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}
            <div className="card">
                <TaskForm
                    categories={categories}
                    onSubmit={handleSubmit}
                    loading={loading}
                />
            </div>
        </div>
    );
}
