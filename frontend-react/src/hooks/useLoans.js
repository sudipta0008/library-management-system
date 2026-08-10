import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import api from "../api/axios";
import { getErrorMessage } from "../utils/errorHandler";

export default function useLoans() {
  const [loans, setLoans] = useState([]);

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
  const [status, setStatus] = useState("");

  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  // -----------------------------
  // Debounce Search
  // -----------------------------
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
  // Reset page on status change
  // -----------------------------
  useEffect(() => {
    setPage(1);
  }, [status]);

  // -----------------------------
  // Fetch Loans
  // -----------------------------
  const fetchLoans = useCallback(
    async (showLoader = false) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        setError("");

        const response = await api.get("/loans", {
          params: {
            page,
            limit,
            search: debouncedSearch,
            status,
          },
        });

        console.log(
          "Loans Response:",
          response.data
        );

        setLoans(
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
        console.error(
          "Loans API Error:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Failed to load loans."
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
      status,
    ]
  );

  // -----------------------------
  // Initial Load + Filters
  // -----------------------------
  useEffect(() => {
    const shouldShowLoader = firstLoad.current;

    firstLoad.current = false;

    fetchLoans(shouldShowLoader);
  }, [fetchLoans]);

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
    setStatus("");
    setPage(1);
  };

  // -----------------------------
  // Return
  // -----------------------------
  return {
    loans,

    loading,
    error,

    refreshLoans: () => fetchLoans(true),

    search,
    setSearch,

    status,
    setStatus,

    resetFilters,

    page,
    pagination,

    nextPage,
    previousPage,
    goToPage,
  };
}