import { useCallback, useEffect, useState } from "react";
import api from "../api/axios";
import { getErrorMessage } from "../utils/errorHandler";

export default function useAudit() {
  const [auditLogs, setAuditLogs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAudit = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/audit");

      console.log(
        "Audit Response:",
        response.data
      );

      setAuditLogs(response.data || []);
    } catch (err) {
      console.error("Audit API Error:", err);

      setError(
        getErrorMessage(
          err,
          "Failed to load audit logs."
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  return {
    auditLogs,

    loading,
    error,

    refreshAudit: fetchAudit,
  };
}