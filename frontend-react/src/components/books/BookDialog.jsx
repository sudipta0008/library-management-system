import { X } from "lucide-react";
import BookForm from "./BookForm";

export default function BookDialog({
  open,
  onClose,
  onSubmit,
  loading,
  mode = "add",
  book = null,
}) {
  if (!open) {
    return null;
  }

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold">
              {isEdit ? "Edit Book" : "Add Book"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isEdit
                ? "Update the book information."
                : "Add a new book to your library collection."}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <div className="max-h-[80vh] overflow-y-auto p-6">

          <BookForm
            mode={mode}
            book={book}
            onSubmit={onSubmit}
            onCancel={onClose}
            loading={loading}
          />

        </div>

      </div>

    </div>
  );
}