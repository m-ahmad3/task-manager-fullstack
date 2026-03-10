import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
            <input
                type="text"
                placeholder="Search tasks..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field pl-9 pr-8"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
