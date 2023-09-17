import express from "express";
import multer from "multer";
import fs from "fs";
import { LoudsModel } from "../models/Louds.js";
import { verifyToken } from "./users.js";

const router = express.Router();
const uploadMiddleware = multer({ dest: "uploads/" });

//fetch all louds
router.get("/", async (req, res) => {
  try {
    const result = await LoudsModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new loud
// router.post("/", verifyToken, async (req, res) => {
//   const loud = new LoudsModel({
//     // _id: new mongoose.Types.ObjectId(),
//     loudType: req.body.loudType,
//     title: req.body.title,
//     place: req.body.place,
//     dateTime: req.body.dateTime,
//     image: req.body.image,
//     description: req.body.description,
//     userOwner: req.body.userOwner,
//   });
//   console.log(loud);

//   try {
//     const result = await loud.save();
//     res.status(201).json({
//       createdLoud: {
//         loudType: result.loudType,
//         title: result.name,
//         place: result.place,
//         dateTime: result.dateTime,
//         image: result.image,
//         description: result.description,
//         userOwner: result.userOwner,
//         _id: result._id,
//       },
//     });
//   } catch (err) {
//     // console.log(err);
//     res.status(500).json(err);
//   }
// });

router.post(
  "/",
  verifyToken,
  uploadMiddleware.single("image"),
  async (req, res) => {
    //console.log("checking: ",req.file);
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const loud = new LoudsModel({
      // _id: new mongoose.Types.ObjectId(),
      loudType: req.body.loudType,
      title: req.body.title,
      place: req.body.place,
      dateTime: req.body.dateTime,
      image: newPath,
      description: req.body.description,
      userOwner: req.body.userOwner,
    });
    //console.log(loud);

    try {
      const result = await loud.save();
      res.status(201).json({
        createdLoud: {
          loudType: result.loudType,
          title: result.name,
          place: result.place,
          dateTime: result.dateTime,
          image: result.image,
          description: result.description,
          userOwner: result.userOwner,
          _id: result._id,
        },
      });
    } catch (err) {
      // console.log(err);
      res.status(500).json(err);
    }
  }
);

//fetch all lost louds
router.get("/lost", verifyToken, async (req, res) => {
  try {
    const result = await LoudsModel.find({ loudType: "LOST" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//fetch all found louds
router.get("/found", verifyToken, async (req, res) => {
  try {
    const result = await LoudsModel.find({ loudType: "FOUND" });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a loud by ID
router.get("/:loudId", verifyToken, async (req, res) => {
  try {
    const result = await LoudsModel.findById(req.params.loudId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all louds of user by userOwner
router.get("/all/:userOwner", verifyToken, async (req, res) => {
  try {
    const result = await LoudsModel.find({ userOwner: req.params.userOwner });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

export { router as loudsRouter };
