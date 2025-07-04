import User from "../../models/User.js";
import {
  blockUserById,
  deleteUser,
  promoteToAdmin,
  unblockUserById,
  updateUserFields,
} from "../../services/userService.js";

jest.mock("../../models/User.js");

describe("userService", () => {
  const userId = "user123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("promoteToAdmin should call findByIdAndUpdate with admin role", async () => {
    await promoteToAdmin(userId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, { role: "admin" });
  });

  it("deleteUser should call findByIdAndDelete with ID", async () => {
    await deleteUser(userId);
    expect(User.findByIdAndDelete).toHaveBeenCalledWith(userId);
  });

  it("updateUserFields should update fields and return new doc", async () => {
    const updates = { username: "newname", phone: "9999999999" };
    await updateUserFields(userId, updates);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, updates, { new: true });
  });

  it("blockUserById should set isBlocked to true", async () => {
    await blockUserById(userId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, { isBlocked: true }, { new: true });
  });

  it("unblockUserById should set isBlocked to false", async () => {
    await unblockUserById(userId);
    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(userId, { isBlocked: false }, { new: true });
  });
});
