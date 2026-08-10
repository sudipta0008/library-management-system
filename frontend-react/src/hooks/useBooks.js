import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import api from "../api/axios";
import { getErrorMessage } from "../utils/errorHandler";

export default function useBooks() {
  // -----------------------------
  // Data
  // -----------------------------
  const [books, setBooks] = useState([]);

  // -----------------------------
  // Pagination
  // -----------------------------
  const [page, setPage] = useState(1);

  const [limit] = useState(10);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // -----------------------------
  // Loading / Error
  // -----------------------------
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const firstLoad = useRef(true);

  // -----------------------------
  // Filters
  // -----------------------------
  const [search, setSearch] = useState("");

  const [genre, setGenre] = useState("");

  const [status, setStatus] = useState("");

  const [sort, setSort] = useState("title");

  // -----------------------------
  // Debounced Search
  // -----------------------------
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // -----------------------------
  // Fetch Books
  // -----------------------------
  const fetchBooks = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response = await api.get("/books", {
          params: {
            page,
            limit,
            search: debouncedSearch,
            genre,
            status,
            sort,
          },
        });

        console.log(
          "Books Response:",
          response.data
        );

        setBooks(
          response.data?.data || []
        );

        setPagination(
          response.data?.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 1,
          }
        );
      } catch (err) {
        console.error("Books API Error:", err);

        setError(
          getErrorMessage(
            err,
            "Failed to load books."
          )
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    [
      page,
      limit,
      debouncedSearch,
      genre,
      status,
      sort,
    ]
  );

  // -----------------------------
  // Initial Load + Filters
  // -----------------------------
  useEffect(() => {
    const shouldShowLoader = firstLoad.current;

    firstLoad.current = false;

    fetchBooks(shouldShowLoader);
  }, [fetchBooks]);

  // -----------------------------
  // Dynamic Genres
  // -----------------------------
  const genres = useMemo(() => {
    return [
      ...new Set(
        books
          .map((book) => book.genre)
          .filter(Boolean)
      ),
    ].sort();
  }, [books]);

  // -----------------------------
  // Pagination
  // -----------------------------
  const nextPage = () => {
    if (page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToPage = (pageNumber) => {
    if (
      pageNumber >= 1 &&
      pageNumber <= pagination.totalPages
    ) {
      setPage(pageNumber);
    }
  };

  // -----------------------------
  // Reset Filters
  // -----------------------------
  const resetFilters = () => {
    setSearch("");
    setGenre("");
    setStatus("");
    setSort("title");
    setPage(1);
  };

  // -----------------------------
  // Return
  // -----------------------------
  return {
    books,

    genres,

    loading,
    error,

    refreshBooks: () => fetchBooks(true),

    search,
    setSearch,

    genre,
    setGenre,

    status,
    setStatus,

    sort,
    setSort,

    resetFilters,

    page,
    pagination,

    nextPage,
    previousPage,
    goToPage,
  };
}