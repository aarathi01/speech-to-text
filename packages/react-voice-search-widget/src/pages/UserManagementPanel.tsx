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

const UserManagementPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedPhone, setEditedPhone] = useState<string>(null);

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

  const handleUpdatePhone = async (userId: string, newPhone: string) => {
    try {
      await updateUser(userId, { phone: newPhone });
      showSuccess("Phone number updated");
      setEditingUserId(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      showError("Failed to update phone number");
      console.error(err);
    }
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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
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
          <div>
            <table className={styles.userTable}>
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Phone</th>
                  <th className="p-2 border">Country</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center p-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.userName}>{user.username}</td>
                      <td className={styles.email}>{user.email}</td>

                      <td className={styles.phoneNumber}>
                        {editingUserId === user._id ? (
                          <input
                            className={styles.editInput}
                            type="text"
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const confirmApply =
                                  window.confirm("Apply changes?");
                                if (confirmApply) {
                                  handleUpdatePhone(user._id, editedPhone);
                                }
                                setEditingUserId(null);
                              } else if (e.key === "Escape") {
                                setEditingUserId(null);
                              }
                            }}
                            onBlur={() => setEditingUserId(null)}
                            autoFocus
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingUserId(user._id);
                              setEditedPhone(user.phone || "");
                            }}
                            style={{
                              cursor: "pointer",
                              display: "inline-block",
                              width: "100%",
                            }}
                            title="Click to edit"
                          >
                            {user.phone || "-"}
                          </span>
                        )}
                      </td>

                      <td className={styles.country}>{user.country}</td>
                      <td className={styles.role}>{user.role}</td>
                      <td className={styles.actions}>
                        <button
                          onClick={() => handlePromote(user._id)}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                          disabled={
                            user.role === "admin" || user.role === "superadmin"
                          }
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
                          className={
                            user.isBlocked ? "bg-blue-600" : "bg-yellow-600"
                          }
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
      </div>
    </>
  );
};

export default UserManagementPanel;
