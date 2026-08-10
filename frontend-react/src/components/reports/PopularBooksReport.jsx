import {
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function PopularBooksReport({
  books = [],
}) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">

      <div className="flex items-center justify-between border-b px-6 py-5">

        <div>
          <h2 className="text-xl font-semibold">
            Popular Books
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Most frequently borrowed books.
          </p>
        </div>

        <TrendingUp
          className="text-blue-500"
          size={22}
        />

      </div>

      {books.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No popular books available.
        </div>
      ) : (
        <div className="divide-y">

          {books.map((book) => (
            <div
              key={book.book_id}
              className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
            >

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-blue-100 p-2">
                  <BookOpen
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="font-medium">
                    {book.title}
                  </p>

                  <p className="text-sm text-gray-500">
                    {book.author} • {book.genre}
                  </p>
                </div>

              </div>

              <div className="text-right">

                <p className="font-semibold text-blue-600">
                  {book.total_issues} issues
                </p>

                <p className="text-xs text-gray-500">
                  {book.currently_issued} currently out
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}