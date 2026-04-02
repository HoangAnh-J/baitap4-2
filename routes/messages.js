const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messages");
const multer = require("multer");

// upload file
const upload = multer({ dest: "uploads/" });

// ❌ BỎ middleware auth vì bạn chưa có file này
// const { verifyToken } = require("../middlewares/auth");

// 1. lấy tin nhắn giữa 2 user
router.get("/:userID", messageController.getMessagesWithUser);

// 2. gửi tin nhắn (file hoặc text)
router.post("/:userID", upload.single("file"), messageController.sendMessage);

// 3. lấy last message mỗi user
router.get("/", messageController.getLastMessages);

module.exports = router;