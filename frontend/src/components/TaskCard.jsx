import { Link } from "react-router-dom";
import { Calendar, Pencil, Trash2, GripVertical, Eye } from "lucide-react";

function getDueDateStatus(dueDate) {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due < today) return "overdue";
    if (due.getTime() === today.getTime()) return "today";
    return "upcoming";
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function TaskCard({
    task,
    onToggleComplete,
    onDelete,
    dragHandleProps,
}) {
    const dueDateStatus = getDueDateStatus(task.due_date);

    const dueDateClasses = {
        overdue: "text-red-600 bg-red-50",
        today: "text-amber-600 bg-amber-50",
        upcoming: "text-charcoal-muted bg-surface-100",
    };

    const priorityClasses = {
        low: "badge-low",
        medium: "badge-medium",
        high: "badge-high",
    };

    return (
        <div
            className={`card group relative ${task.is_completed ? "opacity-60" : ""
                }`}
        >
            <div className="flex items-start gap-3">
                <div
                    {...dragHandleProps}
                    className="mt-1 flex-shrink-0 cursor-grab text-surface-300 hover:text-charcoal-muted opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${task.is_completed
                        ? "bg-charcoal border-charcoal"
                        : "border-surface-300 hover:border-charcoal"
                        }`}
                    title={task.is_completed ? "Mark incomplete" : "Mark complete"}
                >
                    {task.is_completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>

                <div className="flex-1 min-w-0 pr-2">
                    <Link
                        to={`/tasks/${task.id}`}
                        className={`block font-medium text-charcoal hover:underline ${task.is_completed ? "line-through" : ""
                            }`}
                    >
                        {task.title}
                    </Link>
                    {task.description && (
                        <p className="mt-1 text-sm text-charcoal-muted line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={priorityClasses[task.priority] || "badge"}>
                            {task.priority}
                        </span>
                        {task.due_date && (
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${dueDateClasses[dueDateStatus] || ""
                                    }`}
                            >
                                <Calendar className="w-3 h-3" />
                                {dueDateStatus === "overdue" && "Overdue: "}
                                {dueDateStatus === "today" && "Today: "}
                                {formatDate(task.due_date)}
                            </span>
                        )}
                        {task.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-100 text-charcoal-muted">
                                {task.category.name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                        to={`/tasks/${task.id}`}
                        className="p-1.5 text-charcoal-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View details"
                    >
                        <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                        to={`/tasks/${task.id}/edit`}
                        className="p-1.5 text-charcoal-muted hover:text-charcoal rounded-lg hover:bg-surface-100 transition-colors"
                        title="Edit task"
                    >
                        <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-1.5 text-charcoal-muted hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
