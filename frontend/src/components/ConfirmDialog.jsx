export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onCancel}>
            <div
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 animate-in"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-semibold text-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-charcoal-muted">{message}</p>
                <div className="mt-5 flex items-center justify-end gap-3">
                    <button onClick={onCancel} className="btn-secondary text-sm">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="btn-danger text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
