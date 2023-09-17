import express from "express";
import { MessagesModel } from "../models/Messages.js";
import { verifyToken } from "./users.js";

const router = express.Router();

//   Create a new message
router.post("/", verifyToken, async (req, res) => {
  const message = new MessagesModel({
    loudId: req.body.loudId,
    connectUserId: req.body.connectUserId,
    message: req.body.message,
    userOwner: req.body.userOwner,
  });
  //console.log(message);

  try {
    const result = await message.save();
    res.status(201).json({
      createdMessage: {
        loudId: result.loudId,
        connectUserId: result.connectUserId,
        message: result.message,
        userOwner: result.userOwner,
        _id: result._id,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
});

// Get messages by loudId and connectUserId
router.get("/:loudId/:connectUserId", verifyToken, async (req, res) => {
  const { loudId, connectUserId } = req.params;
  // console.log(loudId,connectUserId);
  try {
    const result = await MessagesModel.find({ loudId, connectUserId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get messages by loudId only
router.get("/:loudId", verifyToken, async (req, res) => {
  const loudId = req.params.loudId;
  // console.log(loudId,connectUserId);
  try {
    const result = await MessagesModel.find({ loudId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as messagesRouter };
