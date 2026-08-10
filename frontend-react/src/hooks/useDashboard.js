import { useEffect, useState } from "react";
import api from "../api/axios";
import { getErrorMessage } from "../utils/errorHandler";

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [genres, setGenres] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [audit, setAudit] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard");

        console.log(
          "Dashboard Response:",
          response.data
        );

        const dashboard =
          response.data?.data || {};

        // Dashboard Stats
        setStats(dashboard.stats || {});

        // Genre Chart
        setGenres(
          dashboard.genreChart || []
        );

        // Active Loans
        setActiveLoans(
          dashboard.activeLoans ||
            dashboard.currentLoans ||
            dashboard.loans ||
            []
        );

        // Recent Audit
        setAudit(
          dashboard.recentAudit ||
            dashboard.audit ||
            dashboard.auditLogs ||
            []
        );

        // Popular Books
        setPopularBooks(
          dashboard.popularBooks || []
        );
      } catch (err) {
        console.error(
          "Dashboard API Error:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "Failed to load dashboard."
          )
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return {
    stats,
    genres,
    activeLoans,
    audit,
    popularBooks,
    loading,
    error,
  };
}