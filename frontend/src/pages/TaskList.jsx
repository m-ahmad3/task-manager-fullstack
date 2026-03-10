import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Filter, Plus, X, Tag, Loader2 } from "lucide-react";

import TaskCard from "../components/TaskCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

import {
    getTasks,
    toggleTaskComplete,
    deleteTask,
    reorderTasks,
    getCategories,
    createCategory,
    deleteCategory,
} from "../services/api";


export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategoriesState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("created_at");
    const [order, setOrder] = useState("desc");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const [deleteId, setDeleteId] = useState(null);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [showFilters, setShowFilters] = useState(false);


    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const params = { page, per_page: 10, sort, order };

            if (statusFilter) params.status = statusFilter;
            if (categoryFilter) params.category_id = categoryFilter;
            if (priorityFilter) params.priority = priorityFilter;
            if (search) params.search = search;

            const res = await getTasks(params);

            setTasks(res.data.tasks);
            setTotalPages(res.data.total_pages);
            setTotal(res.data.total);

        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, categoryFilter, priorityFilter, search, sort, order]);


    const fetchCategories = useCallback(async () => {
        try {
            const res = await getCategories();
            setCategoriesState(res.data);
        } catch (err) {
        }
    }, []);


    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        setPage(1);
    }, [statusFilter, categoryFilter, priorityFilter, search, sort, order]);


    const handleToggleComplete = async (taskId) => {
        try {
            await toggleTaskComplete(taskId);
            fetchTasks();
        } catch (err) {
            setError("Failed to update task");
        }
    };

    const handleDeleteClick = (taskId) => setDeleteId(taskId);

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteTask(deleteId);
            setDeleteId(null);
            fetchTasks();
        } catch (err) {
            setError("Failed to delete task");
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reordered = Array.from(tasks);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        setTasks(reordered);

        try {
            await reorderTasks(reordered.map((t) => t.id));
        } catch (err) {
            fetchTasks();
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await createCategory({ name: newCategoryName.trim() });
            setNewCategoryName("");
            fetchCategories();
        } catch (err) {
            setError("Failed to create category");
        }
    };

    const handleDeleteCategory = async (catId) => {
        try {
            await deleteCategory(catId);
            if (categoryFilter === catId.toString()) setCategoryFilter("");
            fetchCategories();
            fetchTasks();
        } catch (err) {
            setError("Failed to delete category");
        }
    };

    const hasActiveFilters = statusFilter || categoryFilter || priorityFilter || search;

    const clearFilters = () => {
        setStatusFilter("");
        setCategoryFilter("");
        setPriorityFilter("");
        setSearch("");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-charcoal">Tasks</h1>
                    <p className="text-sm text-charcoal-muted mt-1">
                        {total} task{total !== 1 ? "s" : ""} total
                    </p>
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`btn-secondary flex items-center gap-1.5 text-sm ${hasActiveFilters ? "border-charcoal" : ""
                        }`}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                    {hasActiveFilters && (
                        <span className="w-2 h-2 rounded-full bg-charcoal" />
                    )}
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center justify-between">
                    {error}
                    <button onClick={() => setError(null)}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {showFilters && (
                <div className="card mb-6 space-y-4">
                    <SearchBar value={search} onChange={setSearch} />

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field text-sm"
                        >
                            <option value="">All statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="input-field text-sm"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="input-field text-sm"
                        >
                            <option value="">All priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>

                        <select
                            value={`${sort}-${order}`}
                            onChange={(e) => {
                                const [s, o] = e.target.value.split("-");
                                setSort(s);
                                setOrder(o);
                            }}
                            className="input-field text-sm"
                        >
                            <option value="created_at-desc">Newest first</option>
                            <option value="created_at-asc">Oldest first</option>
                            <option value="due_date-asc">Due date (earliest)</option>
                            <option value="due_date-desc">Due date (latest)</option>
                            <option value="priority-desc">Priority (high → low)</option>
                            <option value="priority-asc">Priority (low → high)</option>
                            <option value="title-asc">Title (A → Z)</option>
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-charcoal-muted hover:text-charcoal flex items-center gap-1"
                        >
                            <X className="w-3 h-3" /> Clear all filters
                        </button>
                    )}

                    <div className="border-t border-surface-200 pt-4 mt-4">
                        <h3 className="text-sm font-medium text-charcoal mb-2 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" /> Manage Categories
                        </h3>

                        <form onSubmit={handleCreateCategory} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New category name"
                                className="input-field text-sm flex-1"
                                maxLength={50}
                            />
                            <button type="submit" className="btn-primary text-sm px-3">
                                <Plus className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 text-charcoal-muted"
                                >
                                    {cat.name}
                                    <button
                                        onClick={() => handleDeleteCategory(cat.id)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            {categories.length === 0 && (
                                <p className="text-xs text-charcoal-muted">No categories yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-6 h-6 text-charcoal-muted animate-spin" />
                </div>

            ) : tasks.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-7 h-7 text-charcoal-muted" />
                    </div>
                    <h2 className="text-lg font-medium text-charcoal">No tasks found</h2>
                    <p className="mt-1 text-sm text-charcoal-muted">
                        {hasActiveFilters
                            ? "Try adjusting your filters"
                            : "Create your first task to get started"}
                    </p>
                </div>

            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="task-list">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-3"
                            >
                                {tasks.map((task, index) => (
                                    <Draggable
                                        key={task.id}
                                        draggableId={task.id.toString()}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={snapshot.isDragging ? "opacity-90" : ""}
                                            >
                                                <TaskCard
                                                    task={task}
                                                    onToggleComplete={handleToggleComplete}
                                                    onDelete={handleDeleteClick}
                                                    dragHandleProps={provided.dragHandleProps}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            {!loading && tasks.length > 0 && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}

            <ConfirmDialog
                isOpen={deleteId !== null}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
}
