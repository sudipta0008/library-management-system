import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  author: "",
  isbn: "",
  genre: "",
  copies: 1,
  available_copies: 1,
};

export default function BookForm({
  mode = "add",
  book = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        genre: book.genre || "",
        copies: book.total_copies || 1,
        available_copies:
          book.available_copies ?? book.total_copies ?? 1,
      });
    } else {
      setForm(initialForm);
    }

    setErrors({});
  }, [isEdit, book]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.author.trim()) {
      newErrors.author = "Author is required.";
    }

    if (
      !isEdit &&
      form.isbn &&
      !/^\d{10}(\d{3})?$/.test(form.isbn.trim())
    ) {
      newErrors.isbn =
        "ISBN must contain 10 or 13 digits.";
    }

    if (!form.copies || Number(form.copies) < 1) {
      newErrors.copies =
        "Total copies must be at least 1.";
    }

    if (
      isEdit &&
      (form.available_copies === "" ||
        Number(form.available_copies) < 0)
    ) {
      newErrors.available_copies =
        "Available copies cannot be negative.";
    }

    if (
      isEdit &&
      Number(form.available_copies) > Number(form.copies)
    ) {
      newErrors.available_copies =
        "Available copies cannot exceed total copies.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (isEdit) {
      onSubmit({
        title: form.title.trim(),
        author: form.author.trim(),
        genre: form.genre.trim() || "General",
        total_copies: Number(form.copies),
        available_copies: Number(form.available_copies),
      });

      return;
    }

    onSubmit({
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn.trim() || null,
      genre: form.genre.trim() || "General",
      copies: Number(form.copies),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Title *
        </label>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter book title"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      {/* Author */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Author *
        </label>

        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Enter author name"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.author && (
          <p className="mt-1 text-sm text-red-500">
            {errors.author}
          </p>
        )}
      </div>

      {/* ISBN */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          ISBN
        </label>

        <input
          type="text"
          name="isbn"
          value={form.isbn}
          onChange={handleChange}
          disabled={isEdit}
          placeholder="10 or 13 digit ISBN"
          maxLength={13}
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:text-gray-500"
        />

        {isEdit && (
          <p className="mt-1 text-xs text-gray-500">
            ISBN cannot be changed after the book is created.
          </p>
        )}

        {errors.isbn && (
          <p className="mt-1 text-sm text-red-500">
            {errors.isbn}
          </p>
        )}
      </div>

      {/* Genre */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Genre
        </label>

        <input
          type="text"
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="e.g. Programming, Fantasy"
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Total Copies */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Total Copies *
        </label>

        <input
          type="number"
          name="copies"
          value={form.copies}
          min="1"
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        {errors.copies && (
          <p className="mt-1 text-sm text-red-500">
            {errors.copies}
          </p>
        )}
      </div>

      {/* Available Copies - Edit only */}
      {isEdit && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Available Copies *
          </label>

          <input
            type="number"
            name="available_copies"
            value={form.available_copies}
            min="0"
            max={form.copies}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.available_copies && (
            <p className="mt-1 text-sm text-red-500">
              {errors.available_copies}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 border-t pt-5">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border px-5 py-2.5 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save Changes"
              : "Add Book"}
        </button>

      </div>
    </form>
  );
}