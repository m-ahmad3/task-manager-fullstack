import {useState, useEffect, useCallback} from "react";
import {Tag, Plus, X, Loader2} from "lucide-react";
import {getCategories, createCategory, deleteCategory} from "../services/api";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getCategories();
            setCategories(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            await createCategory({ name: newCategoryName.trim() });
            setNewCategoryName("");
            fetchCategories();
        } catch (err) {
            setError("Failed to create category. It may already exist.");
        }
    };

    const handleDeleteCategory = async (catId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await deleteCategory(catId);
            fetchCategories();
        } catch (err) {
            setError("Failed to delete category.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-bold text-charcoal mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6" /> Manage Categories
            </h1>

            {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center justify-between">
                    {error}
                    <button onClick={() => setError(null)}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="card mb-8">
                <h2 className="text-lg font-medium text-charcoal mb-4">Add New Category</h2>
                <form onSubmit={handleCreateCategory} className="flex gap-3">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="e.g. Work, Personal, Urgent"
                        className="input-field flex-1"
                        maxLength={50}
                        required
                    />
                    <button type="submit" className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </form>
            </div>

            <div className="card">
                <h2 className="text-lg font-medium text-charcoal mb-4">Existing Categories</h2>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 text-charcoal-muted animate-spin" />
                    </div>
                ) : categories.length === 0 ? (
                    <p className="text-sm text-charcoal-muted text-center py-4">
                        No categories found. Create one above!
                    </p>
                ) : (
                    <ul className="space-y-3">
                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className="flex items-center justify-between p-3 rounded-lg border border-surface-200 bg-surface-50"
                            >
                                <span className="font-medium text-charcoal flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-charcoal-muted" />
                                    {cat.name}
                                </span>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-2 text-charcoal-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete category"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
