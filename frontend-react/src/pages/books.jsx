import { useState } from "react";

import useBooks from "../hooks/useBooks";
import api from "../api/axios";

import BookHeader from "../components/books/BookHeader";
import BookToolbar from "../components/books/BookToolbar";
import BookTable from "../components/books/BookTable";
import BookPagination from "../components/books/BookPagination";
import BookDialog from "../components/books/BookDialog";
import DeleteBookDialog from "../components/books/DeleteBookDialog";

export default function Books() {
  const {
    books,
    genres,

    loading,
    error,

    refreshBooks,

    search,
    setSearch,

    genre,
    setGenre,

    status,
    setStatus,

    sort,
    setSort,

    page,
    pagination,

    previousPage,
    nextPage,
    goToPage,
  } = useBooks();

  // Add Dialog
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Edit Dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
const [deletingBook, setDeletingBook] = useState(false);

  // Selected Book
  const [selectedBook, setSelectedBook] = useState(null);

  // CRUD Loading
  const [savingBook, setSavingBook] = useState(false);

  // Messages
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  // --------------------------------
  // Add Book
  // --------------------------------
  const handleAddBook = async (bookData) => {
    try {
      setSavingBook(true);
      setFormError("");
      setSuccessMessage("");

      const response = await api.post(
        "/books",
        bookData
      );

      setShowAddDialog(false);

      setSuccessMessage(
        response.data.message ||
          "Book added successfully."
      );

      await refreshBooks();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);

      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add book."
      );
    } finally {
      setSavingBook(false);
    }
  };

  // --------------------------------
  // Open Edit Dialog
  // --------------------------------
  const handleOpenEdit = (book) => {
    setSelectedBook(book);
    setFormError("");
    setShowEditDialog(true);
  };

  // --------------------------------
  // Update Book
  // --------------------------------
  const handleUpdateBook = async (bookData) => {
    if (!selectedBook) {
      return;
    }

    try {
      setSavingBook(true);
      setFormError("");
      setSuccessMessage("");

      const response = await api.put(
        `/books/${selectedBook.book_id}`,
        bookData
      );

      console.log(
        "Update Book Response:",
        response.data
      );

      setShowEditDialog(false);
      setSelectedBook(null);

      setSuccessMessage(
        response.data.message ||
          "Book updated successfully."
      );

      await refreshBooks();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);

      setFormError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update book."
      );
    } finally {
      setSavingBook(false);
    }
  };
  const handleOpenDelete = (book) => {
  setSelectedBook(book);
  setFormError("");
  setShowDeleteDialog(true);
};
const handleDeleteBook = async () => {
  if (!selectedBook) {
    return;
  }

  try {
    setDeletingBook(true);
    setFormError("");
    setSuccessMessage("");

    const response = await api.delete(
      `/books/${selectedBook.book_id}`
    );

    setShowDeleteDialog(false);
    setSelectedBook(null);

    setSuccessMessage(
      response.data.message ||
        "Book deleted successfully."
    );

    await refreshBooks();

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (err) {
    console.error(err);

    setFormError(
      err.response?.data?.message ||
        err.message ||
        "Failed to delete book."
    );
  } finally {
    setDeletingBook(false);
  }
};

  // --------------------------------
  // Loading
  // --------------------------------
  if (loading) {
    return <h2>Loading Books...</h2>;
  }

  // --------------------------------
  // Error
  // --------------------------------
  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <BookHeader
        onRefresh={refreshBooks}
        onAddBook={() => {
          setFormError("");
          setShowAddDialog(true);
        }}
      />

      {/* Success */}
      {successMessage && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {/* Error */}
      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Toolbar */}
      <BookToolbar
        genres={genres}
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />

      {/* Table */}
      <BookTable
        books={books}
        onEditBook={handleOpenEdit}
        onDeleteBook={handleOpenDelete}
      />

      {/* Pagination */}
      <BookPagination
        page={page}
        pagination={pagination}
        previousPage={previousPage}
        nextPage={nextPage}
        goToPage={goToPage}
      />

      {/* Add Dialog */}
      <BookDialog
        open={showAddDialog}
        mode="add"
        onClose={() => {
          if (!savingBook) {
            setShowAddDialog(false);
            setFormError("");
          }
        }}
        onSubmit={handleAddBook}
        loading={savingBook}
      />

      {/* Edit Dialog */}
      <BookDialog
        open={showEditDialog}
        mode="edit"
        book={selectedBook}
        onClose={() => {
          if (!savingBook) {
            setShowEditDialog(false);
            setSelectedBook(null);
            setFormError("");
          }
        }}
        onSubmit={handleUpdateBook}
        loading={savingBook}
      />

      <DeleteBookDialog
  open={showDeleteDialog}
  book={selectedBook}
  onClose={() => {
    if (!deletingBook) {
      setShowDeleteDialog(false);
      setSelectedBook(null);
    }
  }}
  onConfirm={handleDeleteBook}
  loading={deletingBook}
/>

    </div>
  );
}