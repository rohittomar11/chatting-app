import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedUserId = req.user.id; // coming from auth middleware

    const users = await User.find({ _id: { $ne: loggedUserId } }).select(
      "-password"
    );

    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
