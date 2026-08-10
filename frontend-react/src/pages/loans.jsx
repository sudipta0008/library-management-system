import { useState } from "react";

import api from "../api/axios";
import useLoans from "../hooks/useLoans";

import LoanHeader from "../components/loans/LoanHeader";
import LoanToolbar from "../components/loans/LoanToolbar";
import LoanTable from "../components/loans/LoanTable";
import LoanPagination from "../components/loans/LoanPagination";
import IssueBookDialog from "../components/loans/IssueBookDialog";
import ReturnBookDialog from "../components/loans/ReturnBookDialog";

export default function Loans() {
  const {
    loans,
    loading,
    error,

    refreshLoans,

    search,
    setSearch,

    status,
    setStatus,

    page,
    pagination,

    previousPage,
    nextPage,
    goToPage,
  } = useLoans();

  // -----------------------------
  // Dialogs
  // -----------------------------
  const [showIssueDialog, setShowIssueDialog] =
    useState(false);

  const [showReturnDialog, setShowReturnDialog] =
    useState(false);

  const [selectedLoan, setSelectedLoan] =
    useState(null);

  // -----------------------------
  // Issue data
  // -----------------------------
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);

  // -----------------------------
  // Loading
  // -----------------------------
  const [actionLoading, setActionLoading] =
    useState(false);

  // -----------------------------
  // Messages
  // -----------------------------
  const [successMessage, setSuccessMessage] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  // -----------------------------
  // Success message
  // -----------------------------
  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 4000);
  };

  // -----------------------------
  // Open Issue Dialog
  // -----------------------------
  const handleOpenIssue = async () => {
    try {
      setActionError("");

      const [
        membersResponse,
        booksResponse,
      ] = await Promise.all([
        api.get("/members", {
          params: {
            page: 1,
            limit: 1000,
            status: "active",
          },
        }),

        api.get("/books", {
          params: {
            page: 1,
            limit: 1000,
          },
        }),
      ]);

      setMembers(
        membersResponse.data.data || []
      );

      setBooks(
        (booksResponse.data.data || []).filter(
          (book) =>
            Number(
              book.available_copies ?? 0
            ) > 0
        )
      );

      setShowIssueDialog(true);
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load members and books."
      );
    }
  };

  // -----------------------------
  // Issue Book
  // -----------------------------
  const handleIssueBook = async (data) => {
    try {
      setActionLoading(true);
      setActionError("");

      const response = await api.post(
        "/loans/issue",
        data
      );

      setShowIssueDialog(false);

      showSuccess(
        response.data.message ||
          "Book issued successfully."
      );

      await refreshLoans();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to issue book."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Open Return Dialog
  // -----------------------------
  const handleOpenReturn = (loan) => {
    setSelectedLoan(loan);
    setActionError("");
    setShowReturnDialog(true);
  };

  // -----------------------------
  // Return Book
  // -----------------------------
  const handleReturnBook = async () => {
    if (!selectedLoan) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      const response = await api.post(
        "/loans/return",
        {
          loan_id: selectedLoan.loan_id,
        }
      );

      setShowReturnDialog(false);
      setSelectedLoan(null);

      const fine = Number(
        response.data?.data?.fine ?? 0
      );

      if (fine > 0) {
        showSuccess(
          `Book returned successfully. Fine: ₹${fine.toFixed(
            2
          )}`
        );
      } else {
        showSuccess(
          response.data.message ||
            "Book returned successfully."
        );
      }

      await refreshLoans();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to return book."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Loading
  // -----------------------------
  if (loading) {
    return (
      <div className="p-6">
        <p className="text-xl font-semibold">
          Loading Loans...
        </p>
      </div>
    );
  }

  // -----------------------------
  // Error
  // -----------------------------
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <LoanHeader
        onRefresh={refreshLoans}
        onIssueBook={handleOpenIssue}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Action Error */}
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Toolbar */}
      <LoanToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}
      <LoanTable
        loans={loans}
        onReturnBook={handleOpenReturn}
      />

      {/* Pagination */}
      <LoanPagination
        page={page}
        pagination={pagination}
        previousPage={previousPage}
        nextPage={nextPage}
        goToPage={goToPage}
      />

      {/* Issue Book Dialog */}
      <IssueBookDialog
        open={showIssueDialog}
        members={members}
        books={books}
        onClose={() => {
          if (!actionLoading) {
            setShowIssueDialog(false);
            setActionError("");
          }
        }}
        onSubmit={handleIssueBook}
        loading={actionLoading}
      />

      {/* Return Book Dialog */}
      <ReturnBookDialog
        open={showReturnDialog}
        loan={selectedLoan}
        onClose={() => {
          if (!actionLoading) {
            setShowReturnDialog(false);
            setSelectedLoan(null);
            setActionError("");
          }
        }}
        onConfirm={handleReturnBook}
        loading={actionLoading}
      />

    </div>
  );
}