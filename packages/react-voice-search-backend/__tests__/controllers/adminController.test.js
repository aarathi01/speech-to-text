import {
  listUsers,
  promoteUserToAdmin,
  deleteUserById,
  updateUserByAdmin,
  blockUser,
  unblockUser,
  getAdminStats,
} from '../../controllers/adminController.js';

import * as userService from '../../services/userService.js';
import User from '../../models/User.js';
import SearchHistory from '../../models/SearchHistory.js';

jest.mock('../../models/User.js');
jest.mock('../../models/SearchHistory.js');
jest.mock('../../services/userService.js');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Admin Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listUsers', () => {
    it('should list users with pagination', async () => {
      const req = { query: { page: '1' } };
      const res = mockRes();

      User.countDocuments.mockResolvedValue(20);
      User.find.mockReturnValue({ skip: () => ({ limit: () => ['user1', 'user2'] }) });

      await listUsers(req, res);

      expect(res.json).toHaveBeenCalledWith({
        users: ['user1', 'user2'],
        page: 1,
        totalPages: 2,
      });
    });

    it('should handle error in listing users', async () => {
      const req = { query: {} };
      const res = mockRes();

      User.countDocuments.mockRejectedValue(new Error('DB error'));

      await listUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to fetch users' });
    });
  });

  describe('promoteUserToAdmin', () => {
    it('should promote user to admin', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.promoteToAdmin.mockResolvedValue();

      await promoteUserToAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'User promoted to admin' });
    });

    it('should handle error in promotion', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.promoteToAdmin.mockRejectedValue(new Error('Failed'));

      await promoteUserToAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to promote user' });
    });
  });

  describe('deleteUserById', () => {
    it('should delete user', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.deleteUser.mockResolvedValue();

      await deleteUserById(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    it('should handle delete error', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.deleteUser.mockRejectedValue(new Error('Failed'));

      await deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to delete user' });
    });
  });

  describe('updateUserByAdmin', () => {
    it('should update valid fields', async () => {
      const req = {
        params: { id: '123' },
        body: { phone: '1111', username: 'sampleusername' },
      };
      const res = mockRes();

      const updatedUser = { _id: '123', username: 'sampleusername' };
      userService.updateUserFields.mockResolvedValue(updatedUser);

      await updateUserByAdmin(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: updatedUser,
      });
    });

    it('should return 400 for no valid fields', async () => {
      const req = {
        params: { id: '123' },
        body: { notAllowed: 'abc' },
      };
      const res = mockRes();

      await updateUserByAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No valid fields to update' });
    });

    it('should return 404 if user not found', async () => {
      const req = {
        params: { id: '123' },
        body: { phone: '1111' },
      };
      const res = mockRes();

      userService.updateUserFields.mockResolvedValue(null);

      await updateUserByAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle update error', async () => {
      const req = {
        params: { id: '123' },
        body: { phone: '1111' },
      };
      const res = mockRes();

      userService.updateUserFields.mockRejectedValue(new Error('Failed'));

      await updateUserByAdmin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update failed' });
    });
  });

  describe('blockUser', () => {
    it('should block user', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const user = { _id: '123', isBlocked: true };
      userService.blockUserById.mockResolvedValue(user);

      await blockUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'User blocked', user });
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.blockUserById.mockResolvedValue(null);

      await blockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle block error', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.blockUserById.mockRejectedValue(new Error('Failed'));

      await blockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to block user' });
    });
  });

  describe('unblockUser', () => {
    it('should unblock user', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      const user = { _id: '123', isBlocked: false };
      userService.unblockUserById.mockResolvedValue(user);

      await unblockUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'User unblocked', user });
    });

    it('should return 404 if user not found', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.unblockUserById.mockResolvedValue(null);

      await unblockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle unblock error', async () => {
      const req = { params: { id: '123' } };
      const res = mockRes();

      userService.unblockUserById.mockRejectedValue(new Error('Failed'));

      await unblockUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Failed to unblock user' });
    });
  });

  describe('getAdminStats', () => {
    it('should return admin stats', async () => {
      const now = Date.now();
      const users = [
        { role: 'user', isBlocked: false },
        { role: 'admin', isBlocked: false },
        { role: 'superadmin', isBlocked: true },
      ];
      const searches = [
        { timestamp: new Date(now).toISOString() },
        { timestamp: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString() },
      ];

      User.find.mockResolvedValue(users);
      SearchHistory.find.mockResolvedValue(searches);

      const req = {};
      const res = mockRes();

      await getAdminStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        totalUsers: 3,
        blockedUsers: 1,
        totalSearches: 2,
        adminCount: 1,
        superadminCount: 1,
        recentQueries: 1,
      });
    });
  });
});
