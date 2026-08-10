import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function IssueBookDialog({
  open,
  onClose,
  onSubmit,
  members = [],
  books = [],
  loading = false,
}) {
  const [memberId, setMemberId] =
    useState("");

  const [bookId, setBookId] =
    useState("");

  const [days, setDays] =
    useState(14);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (open) {
      setMemberId("");
      setBookId("");
      setDays(14);
      setError("");
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!memberId) {
      setError("Please select a member.");
      return;
    }

    if (!bookId) {
      setError("Please select a book.");
      return;
    }

    if (!days || Number(days) <= 0) {
      setError(
        "Loan duration must be greater than 0."
      );
      return;
    }

    setError("");

    onSubmit({
      member_id: Number(memberId),
      book_id: Number(bookId),
      days: Number(days),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold">
              Issue Book
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Issue a book to a library member.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Member */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Member *
            </label>

            <select
              value={memberId}
              onChange={(e) =>
                setMemberId(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member.member_id}
                  value={member.member_id}
                >
                  {member.name} — {member.email}
                </option>
              ))}
            </select>
          </div>

          {/* Book */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Book *
            </label>

            <select
              value={bookId}
              onChange={(e) =>
                setBookId(e.target.value)
              }
              className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">
                Select Book
              </option>

              {books.map((book) => (
                <option
                  key={book.book_id}
                  value={book.book_id}
                >
                  {book.title}
                  {book.available_copies !== undefined
                    ? ` — ${book.available_copies} available`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Days */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Loan Duration
            </label>

            <div className="flex items-center gap-3">

              <input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) =>
                  setDays(e.target.value)
                }
                className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-blue-500"
              />

              <span className="text-sm text-gray-500">
                days
              </span>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 border-t pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border px-5 py-2.5 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Issuing..."
                : "Issue Book"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}