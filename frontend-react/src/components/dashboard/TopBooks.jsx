import {
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function TopBooks({
  books = [],
}) {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">

      <div className="mb-6 flex items-center justify-between">

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Top Borrowed Books
        </h2>

        <TrendingUp
          size={21}
          className="text-blue-500"
        />

      </div>

      {books.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          No data available.
        </p>
      ) : (
        <div className="space-y-3">

          {books.map((book) => (

            <div
              key={book.book_id}
              className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
            >

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50">

                  <BookOpen
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />

                </div>

                <div className="min-w-0">

                  <p className="truncate font-medium text-gray-900 dark:text-gray-100">
                    {book.title}
                  </p>

                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {book.author}
                  </p>

                </div>

              </div>

              <span className="shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400">
                {book.total_issues} Issues
              </span>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}