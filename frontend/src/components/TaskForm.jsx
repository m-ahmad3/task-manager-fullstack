import { useState, useEffect } from "react";

export default function TaskForm({ initialData, categories, onSubmit, loading }) {
    // Form state — controlled inputs
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");
    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setDescription(initialData.description || "");
            setDueDate(initialData.due_date || "");
            setPriority(initialData.priority || "medium");
            setCategoryId(initialData.category_id?.toString() || "");
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            title: title.trim(),
            description: description.trim() || null,
            due_date: dueDate || null,
            priority,
            category_id: categoryId ? parseInt(categoryId) : null,
        };

        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="title" className="label">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field"
                    placeholder="What needs to be done?"
                    maxLength={100}
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="label">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field resize-none"
                    placeholder="Add more details..."
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dueDate" className="label">
                        Due Date
                    </label>
                    <input
                        id="dueDate"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div>
                    <label htmlFor="priority" className="label">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="input-field"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label htmlFor="category" className="label mb-0">
                        Category
                    </label>
                    <a href="/categories" className="text-xs text-charcoal-muted hover:text-charcoal hover:underline">
                        Manage Categories &rarr;
                    </a>
                </div>
                <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="input-field"
                >
                    <option value="">No category</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="submit"
                disabled={loading || !title.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
            </button>
        </form>
    );
}
