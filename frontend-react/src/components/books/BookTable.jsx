import {
  Pencil,
  Trash2,
} from "lucide-react";

export default function BookTable({
  books,
  onEditBook,
  onDeleteBook,
}) {
  function getStatusClass(status) {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-700";

      case "Low Stock":
        return "bg-yellow-100 text-yellow-700";

      case "Out of Stock":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (books.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center">
        <p className="text-gray-500">
          No books found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">

      <table className="w-full min-w-[1100px]">

        <thead>
          <tr className="border-b bg-gray-50 text-left">

            <th className="px-5 py-4 text-sm font-semibold">
              Book
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Author
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Genre
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              ISBN
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Total
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Available
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Issued
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Availability
            </th>

            <th className="px-5 py-4 text-sm font-semibold">
              Status
            </th>

            <th className="px-5 py-4 text-right text-sm font-semibold">
              Actions
            </th>

          </tr>
        </thead>

        <tbody>

          {books.map((book) => (

            <tr
              key={book.book_id}
              className="border-b last:border-b-0 hover:bg-gray-50"
            >

              <td className="px-5 py-4 font-medium">
                {book.title}
              </td>

              <td className="px-5 py-4">
                {book.author}
              </td>

              <td className="px-5 py-4">
                {book.genre}
              </td>

              <td className="px-5 py-4 font-mono text-xs">
                {book.isbn || "—"}
              </td>

              <td className="px-5 py-4">
                {book.total_copies}
              </td>

              <td className="px-5 py-4">
                {book.available_copies}
              </td>

              <td className="px-5 py-4">
                {book.checked_out}
              </td>

              <td className="px-5 py-4">
                {book.availability_percentage}%
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                    book.inventory_status
                  )}`}
                >
                  {book.inventory_status}
                </span>
              </td>

              <td className="px-5 py-4">

                <div className="flex justify-end gap-2">

                  <button
                    onClick={() => onEditBook(book)}
                    title="Edit Book"
                    className="rounded-lg p-2 hover:bg-blue-100"
                  >
                    <Pencil
                      size={18}
                      className="text-blue-600"
                    />
                  </button>

                  <button
                    onClick={() => onDeleteBook?.(book)}
                    title="Delete Book"
                    className="rounded-lg p-2 hover:bg-red-100"
                  >
                    <Trash2
                      size={18}
                      className="text-red-600"
                    />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}