import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body; // FIXED

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    return res.status(200).json({
      message: "Message sent",
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message }); // FIXED
  }
};

export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
