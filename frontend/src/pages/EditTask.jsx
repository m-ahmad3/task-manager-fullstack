import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import TaskForm from "../components/TaskForm";
import { getTask, updateTask, getCategories } from "../services/api";

export default function EditTask() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskRes, catRes] = await Promise.all([
                    getTask(id),
                    getCategories(),
                ]);
                setTask(taskRes.data);
                setCategories(catRes.data);
            } catch (err) {
                setError("Task not found");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);
    const handleSubmit = async (data) => {
        setSaving(true);
        setError(null);
        try {
            await updateTask(id, data);
            navigate(`/tasks/${id}`); 
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to update task");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-charcoal-muted animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
            <Link
                to={`/tasks/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Task
            </Link>

            <h1 className="text-2xl font-bold text-charcoal mb-6">Edit Task</h1>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            <div className="card">
                <TaskForm
                    initialData={task}
                    categories={categories}
                    onSubmit={handleSubmit}
                    loading={saving}
                />
            </div>
        </div>
    );
}
