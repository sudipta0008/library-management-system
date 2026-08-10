import { useState } from "react";

import useMembers from "../hooks/useMembers";
import api from "../api/axios";

import MemberHeader from "../components/members/MemberHeader";
import MemberToolbar from "../components/members/MemberToolbar";
import MemberTable from "../components/members/MemberTable";
import MemberPagination from "../components/members/MemberPagination";
import MemberDialog from "../components/members/MemberDialog";
import DeleteMemberDialog from "../components/members/DeleteMemberDialog";
import MemberActionDialog from "../components/members/MemberActionDialog";

export default function Members() {
  const {
    members,
    loading,
    error,

    refreshMembers,

    search,
    setSearch,

    status,
    setStatus,

    page,
    pagination,

    previousPage,
    nextPage,
    goToPage,
  } = useMembers();

  // -----------------------------
  // Dialogs
  // -----------------------------
  const [showAddDialog, setShowAddDialog] =
    useState(false);

  const [showEditDialog, setShowEditDialog] =
    useState(false);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [showActionDialog, setShowActionDialog] =
    useState(false);

  // -----------------------------
  // Selected member
  // -----------------------------
  const [selectedMember, setSelectedMember] =
    useState(null);

  const [actionType, setActionType] =
    useState("");

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
    }, 3000);
  };

  // -----------------------------
  // Add Member
  // -----------------------------
  const handleAddMember = async (memberData) => {
    try {
      setActionLoading(true);
      setActionError("");

      const response = await api.post(
        "/members",
        memberData
      );

      setShowAddDialog(false);

      showSuccess(
        response.data.message ||
          "Member added successfully."
      );

      await refreshMembers();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add member."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Open Edit
  // -----------------------------
  const handleOpenEdit = (member) => {
    setSelectedMember(member);
    setActionError("");
    setShowEditDialog(true);
  };

  // -----------------------------
  // Update Member
  // -----------------------------
  const handleUpdateMember = async (
    memberData
  ) => {
    if (!selectedMember) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      const response = await api.put(
        `/members/${selectedMember.member_id}`,
        memberData
      );

      setShowEditDialog(false);
      setSelectedMember(null);

      showSuccess(
        response.data.message ||
          "Member updated successfully."
      );

      await refreshMembers();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update member."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Open Delete
  // -----------------------------
  const handleOpenDelete = (member) => {
    setSelectedMember(member);
    setActionError("");
    setShowDeleteDialog(true);
  };

  // -----------------------------
  // Delete Member
  // -----------------------------
  const handleDeleteMember = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      const response = await api.delete(
        `/members/${selectedMember.member_id}`
      );

      setShowDeleteDialog(false);
      setSelectedMember(null);

      showSuccess(
        response.data.message ||
          "Member deleted successfully."
      );

      await refreshMembers();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete member."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Open Reactivate
  // -----------------------------
  const handleOpenReactivate = (member) => {
    setSelectedMember(member);
    setActionType("reactivate");
    setActionError("");
    setShowActionDialog(true);
  };

  // -----------------------------
  // Open Pay Fines
  // -----------------------------
  const handleOpenPayFines = (member) => {
    setSelectedMember(member);
    setActionType("pay-fines");
    setActionError("");
    setShowActionDialog(true);
  };

  // -----------------------------
  // Confirm Member Action
  // -----------------------------
  const handleMemberAction = async () => {
    if (!selectedMember) {
      return;
    }

    try {
      setActionLoading(true);
      setActionError("");

      let response;

      if (actionType === "reactivate") {
        response = await api.patch(
          `/members/${selectedMember.member_id}/reactivate`
        );
      }

      if (actionType === "pay-fines") {
        response = await api.patch(
          `/members/${selectedMember.member_id}/pay-fines`
        );
      }

      setShowActionDialog(false);
      setSelectedMember(null);
      setActionType("");

      showSuccess(
        response?.data?.message ||
          "Action completed successfully."
      );

      await refreshMembers();
    } catch (err) {
      console.error(err);

      setActionError(
        err.response?.data?.message ||
          err.message ||
          "Action failed."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // -----------------------------
  // Initial Loading
  // -----------------------------
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">
          Loading Members...
        </h2>
      </div>
    );
  }

  // -----------------------------
  // Initial Error
  // -----------------------------
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <MemberHeader
        onRefresh={refreshMembers}
        onAddMember={() => {
          setActionError("");
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
      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* Search + Filter */}
      <MemberToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}
      <MemberTable
        members={members}
        onEditMember={handleOpenEdit}
        onDeleteMember={handleOpenDelete}
        onReactivateMember={handleOpenReactivate}
        onPayFines={handleOpenPayFines}
      />

      {/* Pagination */}
      <MemberPagination
        page={page}
        pagination={pagination}
        previousPage={previousPage}
        nextPage={nextPage}
        goToPage={goToPage}
      />

      {/* =========================
          ADD MEMBER
      ========================= */}
      <MemberDialog
        open={showAddDialog}
        mode="add"
        onClose={() => {
          if (!actionLoading) {
            setShowAddDialog(false);
            setActionError("");
          }
        }}
        onSubmit={handleAddMember}
        loading={actionLoading}
      />

      {/* =========================
          EDIT MEMBER
      ========================= */}
      <MemberDialog
        open={showEditDialog}
        mode="edit"
        member={selectedMember}
        onClose={() => {
          if (!actionLoading) {
            setShowEditDialog(false);
            setSelectedMember(null);
            setActionError("");
          }
        }}
        onSubmit={handleUpdateMember}
        loading={actionLoading}
      />

      {/* =========================
          DELETE MEMBER
      ========================= */}
      <DeleteMemberDialog
        open={showDeleteDialog}
        member={selectedMember}
        onClose={() => {
          if (!actionLoading) {
            setShowDeleteDialog(false);
            setSelectedMember(null);
            setActionError("");
          }
        }}
        onConfirm={handleDeleteMember}
        loading={actionLoading}
      />

      {/* =========================
          REACTIVATE / PAY FINES
      ========================= */}
      <MemberActionDialog
        open={showActionDialog}
        type={actionType}
        member={selectedMember}
        onClose={() => {
          if (!actionLoading) {
            setShowActionDialog(false);
            setSelectedMember(null);
            setActionType("");
            setActionError("");
          }
        }}
        onConfirm={handleMemberAction}
        loading={actionLoading}
      />

    </div>
  );
}