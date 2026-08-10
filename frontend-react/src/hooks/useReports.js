import { useCallback, useEffect, useState } from "react";

import api from "../api/axios";
import { getErrorMessage } from "../utils/errorHandler";

export default function useReports() {
  const [popularBooks, setPopularBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [fineSummary, setFineSummary] = useState([]);
  const [genreReport, setGenreReport] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Fetch Reports
  // -----------------------------
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        popularResponse,
        overdueResponse,
        fineResponse,
        genreResponse,
        auditResponse,
      ] = await Promise.all([
        api.get("/reports/popular-books"),
        api.get("/reports/overdue"),
        api.get("/reports/fine-summary"),
        api.get("/reports/genre-report"),
        api.get("/reports/audit"),
      ]);

      console.log(
        "Popular Books:",
        popularResponse.data
      );

      console.log(
        "Overdue Books:",
        overdueResponse.data
      );

      console.log(
        "Fine Summary:",
        fineResponse.data
      );

      console.log(
        "Genre Report:",
        genreResponse.data
      );

      console.log(
        "Audit Log:",
        auditResponse.data
      );

      setPopularBooks(
        popularResponse.data || []
      );

      setOverdueBooks(
        overdueResponse.data || []
      );

      setFineSummary(
        fineResponse.data || []
      );

      setGenreReport(
        genreResponse.data || []
      );

      setAuditLogs(
        auditResponse.data || []
      );
    } catch (err) {
      console.error(
        "Reports API Error:",
        err
      );

      setError(
        getErrorMessage(
          err,
          "Failed to load reports."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // Initial Load
  // -----------------------------
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // -----------------------------
  // Return
  // -----------------------------
  return {
    popularBooks,
    overdueBooks,
    fineSummary,
    genreReport,
    auditLogs,

    loading,
    error,

    refreshReports: fetchReports,
  };
}