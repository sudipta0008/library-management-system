import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function LoanPagination({
  page,
  pagination,
  previousPage,
  nextPage,
  goToPage,
}) {
  if (
    !pagination ||
    pagination.totalPages <= 1
  ) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <p className="text-sm text-gray-500">
        Showing page {pagination.page} of{" "}
        {pagination.totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">

        <button
          onClick={previousPage}
          disabled={page === 1}
          className="flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {Array.from(
          {
            length: pagination.totalPages,
          },
          (_, index) => index + 1
        ).map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() =>
              goToPage(pageNumber)
            }
            className={`h-10 w-10 rounded-lg border ${
              pageNumber === page
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={
            page === pagination.totalPages
          }
          className="flex items-center gap-1 rounded-lg border px-3 py-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight size={16} />
        </button>

      </div>
    </div>
  );
}