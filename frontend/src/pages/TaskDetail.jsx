import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft, Calendar, Clock, Pencil, Trash2, CheckCircle2, Circle, Loader2,
} from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import { getTask, deleteTask, toggleTaskComplete } from "../services/api";

export default function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await getTask(id);
                setTask(res.data);
            } catch (err) {
                setError("Task not found");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteTask(id);
            navigate("/");
        } catch (err) {
            setError("Failed to delete task");
        }
    };

    const handleToggle = async () => {
        try {
            const res = await toggleTaskComplete(id);
            setTask(res.data);
        } catch (err) {
            setError("Failed to update task");
        }
    };

    const priorityClasses = {
        low: "badge-low",
        medium: "badge-medium",
        high: "badge-high",
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-charcoal-muted animate-spin" />
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <h2 className="text-lg font-medium text-charcoal">{error || "Task not found"}</h2>
                <Link to="/" className="mt-4 btn-secondary inline-block text-sm">
                    Back to Tasks
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm text-charcoal-muted hover:text-charcoal mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Tasks
            </Link>

            <div className="card">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1
                            className={`text-xl font-bold text-charcoal ${task.is_completed ? "line-through opacity-60" : ""
                                }`}
                        >
                            {task.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className={priorityClasses[task.priority]}>
                                {task.priority} priority
                            </span>
                            <span
                                className={`badge ${task.is_completed
                                    ? "bg-green-50 text-green-700"
                                    : "bg-surface-100 text-charcoal-muted"
                                    }`}
                            >
                                {task.is_completed ? "Completed" : "Pending"}
                            </span>
                            {task.category && (
                                <span className="badge bg-surface-100 text-charcoal-muted">
                                    {task.category.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1 ml-4">
                        <button
                            onClick={handleToggle}
                            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
                            title={task.is_completed ? "Mark incomplete" : "Mark complete"}
                        >
                            {task.is_completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                                <Circle className="w-5 h-5 text-charcoal-muted" />
                            )}
                        </button>
                        <Link
                            to={`/tasks/${task.id}/edit`}
                            className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-charcoal-muted hover:text-charcoal"
                        >
                            <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-charcoal-muted hover:text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {task.description && (
                    <div className="mt-5 pt-5 border-t border-surface-200">
                        <h2 className="text-sm font-medium text-charcoal-muted mb-2">Description</h2>
                        <p className="text-charcoal leading-relaxed whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>
                )}

                <div className="mt-5 pt-5 border-t border-surface-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {task.due_date && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-charcoal-muted" />
                            <span className="text-charcoal-muted">Due:</span>
                            <span className="text-charcoal">
                                {new Date(task.due_date).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-charcoal-muted" />
                        <span className="text-charcoal-muted">Created:</span>
                        <span className="text-charcoal">
                            {new Date(task.created_at).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
}
