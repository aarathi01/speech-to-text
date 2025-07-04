import React, { useEffect, useState } from "react";
import LogoutIcon from "../assets/logout.svg";
import Sidebar from "../components/Sidebar";
import ConfirmDeleteModal from "../components/ConfirmActionModal";
import HistoryModal from "../components/userManagement/SearchHistoryModal";
import UserActionDropdown from "../components/ui/UserActionDropdown";
import { useAuth } from "../context/useAuth";
import { logout } from "../services/authService";
import {
  getAllUsers,
  promoteToAdmin,
  deleteUser,
  updateUser,
  unblockUser,
  blockUser,
} from "../services/userService";
import { showError, showSuccess } from "../utils/errorHandler";
import { validateField } from "../utils/validators";
import { User } from "../types/userTypes";
import styles from "./UserManagementPanel.module.css";

const UserManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editingField, setEditingField] = useState<{
    userId: string;
    field: keyof User;
  } | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string>("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null); // for modal
  const [currentUser, setCurrentUser] = useState({
    _id: "",
    role: "",
    email: "",
    username: "",
  });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    userId: string;
    field: keyof User;
    value: string;
  } | null>(null);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await getAllUsers(page);
      const { users, page: current, totalPages } = res.data;
      setUsers(users);
      setCurrentPage(current);
      setTotalPages(totalPages);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch users");
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      await promoteToAdmin(userId);
      showSuccess("User promoted to admin");
      fetchUsers(currentPage);
    } catch {
      showError("Failed to promote user");
    }
  };

  const confirmDeleteUser = (userId: string) => {
    setDeleteUserId(userId);
  };

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      showSuccess("User deleted");
      fetchUsers(currentPage);
    } catch {
      showError("Failed to delete user");
    } finally {
      setDeleteUserId(null);
    }
  };

  const confirmApplyChanges = async () => {
    if (!pendingEdit) return;
    const { userId, field, value } = pendingEdit;
    await handleUpdate(userId, field, value);
    setPendingEdit(null);
    setShowApplyModal(false);
  };

  const handleBlockToggle = async (
    userId: string,
    currentlyBlocked: boolean
  ) => {
    try {
      if (currentlyBlocked) {
        await unblockUser(userId);
        showSuccess("User unblocked");
      } else {
        await blockUser(userId);
        showSuccess("User blocked");
      }
      fetchUsers(currentPage);
    } catch {
      showError("Failed to update block status");
    }
  };

  const handleEditStart = (
    userId: string,
    field: keyof User,
    currentValue: string
  ) => {
    setEditingField({ userId, field });
    setEditedValue(currentValue || "");
    setEditError("");
  };

  const handleUpdate = async (
    userId: string,
    field: keyof User,
    value: string
  ) => {
    const validationKey = field === "username" ? "name" : field;
    const error = validateField(validationKey, value);
    if (error) {
      setEditError(error);
      return;
    }

    try {
      await updateUser(userId, { [field]: value });
      showSuccess(`${field} updated`);
      setEditingField(null);
      setEditError("");
      fetchUsers(currentPage);
    } catch (err) {
      showError(`Failed to update ${field}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
    setCurrentUser({
      _id: user?._id || "",
      role: user?.role || "",
      email: user?.email || "",
      username: user?.username || "",
    });
  }, [currentPage, user]);

  const renderEditableCell = (
    user: User,
    field: keyof User,
    className: string
  ) => {
    const isEditing =
      editingField?.userId === user._id && editingField.field === field;

    return (
      <td className={className}>
        {isEditing ? (
          <>
            <input
              className={styles.editInput}
              value={editedValue}
              role="button"
              onChange={(e) => {
                setEditedValue(e.target.value);
                const validationKey = field === "username" ? "name" : field;
                setEditError(validateField(validationKey, e.target.value));
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (editError) {
                    showError("Fix validation error before applying.");
                    return;
                  }
                  setPendingEdit({
                    userId: user._id,
                    field,
                    value: editedValue,
                  });
                  setShowApplyModal(true);
                } else if (e.key === "Escape") {
                  setEditingField(null);
                  setEditError("");
                }
              }}
              onBlur={() => {
                setEditingField(null);
                setEditError("");
              }}
            />
            {editError && <div className={styles.errorText}>{editError}</div>}
          </>
        ) : (
          <span
            onClick={() =>
              handleEditStart(user._id, field, user[field] as string)
            }
            style={{
              cursor: "pointer",
              display: "inline-block",
              width: "100%",
            }}
            title="Click to edit"
          >
            {user[field] || "-"}
          </span>
        )}
      </td>
    );
  };

  return (
    <div className={styles.pageContainer}>
      <Sidebar />

      <div className={styles.container}>
        {/* Header */}
        <div className="header-row">
          <h2 className="header-title">All Users</h2>
          <div className="logged-info">
            <div className="icon-with-tooltip">
              <img
                className="logout-icon"
                src={LogoutIcon}
                alt="Logout"
                onClick={logout}
              />
              <span className="tooltip-text-bottom">Logout</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.userTable} role="table">
            <thead>
              <tr>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Country</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    {renderEditableCell(user, "username", styles.userName)}
                    <td className={styles.email}>{user.email}</td>
                    {renderEditableCell(user, "phone", styles.phoneNumber)}
                    {renderEditableCell(user, "country", styles.country)}
                    <td className={styles.role}>{user.role}</td>
                    <td className={styles.actions}>
                      <UserActionDropdown
                        onPromote={() => handlePromote(user._id)}
                        onHistory={() => setSelectedUserId(user._id)}
                        onBlockToggle={() =>
                          handleBlockToggle(user._id, user.isBlocked)
                        }
                        onDelete={() => confirmDeleteUser(user._id)}
                        role={currentUser.role}
                        targetUserRole={user.role}
                        isBlocked={user.isBlocked}
                        isCurrentUser={user._id === currentUser._id}
                        canPromote={
                          currentUser.role === "superadmin" &&
                          !["admin", "superadmin"].includes(user.role)
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            type="button"
            aria-label="Previous Page"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            aria-label="Next Page"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Modals */}
        {selectedUserId && (
          <HistoryModal
            userId={selectedUserId}
            onClose={() => setSelectedUserId(null)}
          />
        )}

        {showApplyModal && (
          <ConfirmDeleteModal
            message="Apply changes to this field?"
            onCancel={() => {
              setShowApplyModal(false);
              setPendingEdit(null);
            }}
            onConfirm={confirmApplyChanges}
            confirmLabel="OK"
            cancelLabel="Cancel"
            confirmStyle="primary"
          />
        )}

        {deleteUserId && (
          <ConfirmDeleteModal
            onCancel={() => setDeleteUserId(null)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this user?"
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementPanel;
