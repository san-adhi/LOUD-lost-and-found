import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { UserModel } from "../models/Users.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const jwtSecret = process.env.JWT_SECRET;
    jwt.verify(authHeader, jwtSecret, (err) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Username or password is incorrect" });
  }
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user._id }, jwtSecret);
  res.json({ token, userID: user._id, username: user.username });
});

//get username by _id
router.get("/:id", verifyToken, async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  res.json({ username: user.username });
});

export { router as userRouter };
