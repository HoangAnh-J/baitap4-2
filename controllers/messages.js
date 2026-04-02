const Message = require("../schemas/messages");

/**
 * GET /messages/:userID
 */
exports.getMessagesWithUser = async (req, res) => {
  try {
    const mongoose = require("mongoose");
const currentUser = new mongoose.Types.ObjectId("69b513d27a435038dc7418e0");
    const { userID } = req.params;

    const messages = await Message.find({
      $or: [
        { from: currentUser, to: userID },
        { from: userID, to: currentUser }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * POST /messages/:userID
 */
exports.sendMessage = async (req, res) => {
  try {
    const mongoose = require("mongoose");
const currentUser = new mongoose.Types.ObjectId("69b513d27a435038dc7418e0");
    const { userID } = req.params;

    let messageContent = {};

    if (req.file) {
      messageContent = {
        type: "file",
        text: req.file.path
      };
    } else {
      messageContent = {
        type: "text",
        text: req.body.text
      };
    }

    const newMessage = new Message({
      from: currentUser,
      to: userID,
      messageContent
    });

    await newMessage.save();

    res.json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET /messages
 * Lấy tin nhắn cuối cùng mỗi user
 */
exports.getLastMessages = async (req, res) => {
  try {
    const mongoose = require("mongoose");
const currentUser = new mongoose.Types.ObjectId("69b513d27a435038dc7418e0");

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: currentUser },
            { to: currentUser }
          ]
        }
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$from", currentUser] },
              "$to",
              "$from"
            ]
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" }
        }
      }
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};