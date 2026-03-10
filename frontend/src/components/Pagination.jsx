import {ChevronLeft, ChevronRight} from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-surface-200 text-charcoal-muted
                   hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${pageNum === page
                            ? "bg-charcoal text-white"
                            : "text-charcoal-muted hover:bg-surface-100"
                        }`}
                >
                    {pageNum}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-surface-200 text-charcoal-muted
                   hover:bg-surface-100 disabled:opacity-30 disabled:cursor-not-allowed
                   transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
