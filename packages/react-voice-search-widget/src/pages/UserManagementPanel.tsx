import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  promoteToAdmin,
  deleteUser,
  updateUser,
  unblockUser,
  blockUser,
} from "../services/userService";
import LogoutIcon from "../assets/logout.svg";
import { logout } from "../services/authService";
import { showError, showSuccess } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import styles from "./UserManagementPanel.module.css";
import { User } from "../types/userTypes";

const UserManagementPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingField, setEditingField] = useState<{
    userId: string;
    field: keyof User;
  } | null>(null);
  const [editedValue, setEditedValue] = useState<string>("");

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showError("Failed to fetch users");
    }
  };

  const handlePromote = async (userId: string) => {
    try {
      await promoteToAdmin(userId);
      showSuccess("User promoted to admin");
      fetchUsers();
    } catch {
      showError("Failed to promote user");
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      showSuccess("User deleted");
      fetchUsers();
    } catch {
      showError("Failed to delete user");
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
    navigate("/login");
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
      fetchUsers();
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
  };

  const handleUpdate = async (
    userId: string,
    field: keyof User,
    value: string
  ) => {
    try {
      await updateUser(userId, { [field]: value });
      showSuccess(`${field} updated`);
      setEditingField(null);
      fetchUsers();
    } catch (err) {
      showError(`Failed to update ${field}`);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
          <input
            className={styles.editInput}
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const confirmApply = window.confirm("Apply changes?");
                if (confirmApply) {
                  handleUpdate(user._id, field, editedValue);
                }
              } else if (e.key === "Escape") {
                setEditingField(null);
              }
            }}
            onBlur={() => setEditingField(null)}
          />
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
    <div className="content">
      <div className="header-row">
        <h2 className="header-title">All Users</h2>
        <div className="icon-with-tooltip">
          <img
            className="logout-icon"
            src={LogoutIcon}
            alt="Logout"
            onClick={handleLogout}
          />
          <span className="tooltip-text-bottom">Logout</span>
        </div>
      </div>
      <div className={styles.container}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td className="text-center p-4">No users found</td>
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
                    <button
                      onClick={() => handlePromote(user._id)}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                      disabled={["admin", "superadmin"].includes(user.role)}
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                      disabled={user.role === "superadmin"}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() =>
                        handleBlockToggle(user._id, user.isBlocked)
                      }
                      className={`px-2 py-1 text-white rounded ${
                        user.isBlocked ? "bg-blue-600" : "bg-yellow-600"
                      }`}
                      disabled={user.role === "superadmin"}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPanel;
