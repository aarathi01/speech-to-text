import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  promoteToAdmin,
  deleteUser,
} from "../services/userService";
import { toast } from "react-toastify";
import LogoutIcon from "../assets/logout.svg";
import { logout } from "../services/authService";
import { showSuccess } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";

const UserManagementPanel: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  const handlePromote = async (id: string) => {
    try {
      await promoteToAdmin(id);
      toast.success("User promoted to admin");
      fetchUsers();
    } catch {
      toast.error("Failed to promote user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
    navigate("/login");
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
        <div className="p-8">
          <div>
           
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Username</th>
                  <th className="p-2 border">Email</th>
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
                      <td className="p-2 border">{user.username}</td>
                      <td className="p-2 border">{user.email}</td>
                      <td className="p-2 border">{user.role}</td>
                      <td className="p-2 border space-x-2">
                        <button
                          onClick={() => handlePromote(user.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                          disabled={
                            user.role === "admin" || user.role === "superadmin"
                          }
                        >
                          Promote
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded"
                          disabled={user.role === "superadmin"}
                        >
                          Delete
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
