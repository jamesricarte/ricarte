const express = require("express");  
const bcrypt = require("bcrypt");   
const jwt = require("jsonwebtoken");
const router = express.Router();  
const user = require("../models/user");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const NewUser = new user({
          email: req.body.email,
          password: hash
        });
        return NewUser.save();
      })
      .then(result => {
        res.status(201).json({
          message: "User Created",
          result: result
        });
      })
      .catch(err => {
        if (err.name === "ValidationError") {
          res.status(400).json({
            message: "Invalid Authentication Credentials!",
            error: err.message
          });
        } else {
          res.status(500).json({
            message: "Something went wrong",
            error: err
          });
        }
      });
  });

  let fetcheduser;

  router.post("/login", async (req, res) => {
    try { 
    const fetchedUser = await user.findOne({ email: req.body.email });

    if (!fetchedUser) {
      return res.status(401).json({ message: "Auth failed: User not found" });
    }

    const isMatch = await bcrypt.compare(req.body.password, fetchedUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Auth failed: Incorrect password" });
    }

    const token = jwt.sign(
      { email: fetchedUser.email, userId: fetchedUser._id },
      "A_very_long_string_for_our_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      email: fetchedUser.email,
    });

  } catch (err) {
    console.error("Login Error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Login failed", error: err });
    }
  }
  }); 

  router.post("/change-password", checkAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const existingUser = await user.findById(req.userData.userId);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, existingUser.password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedNewPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password change failed", error: err });
  }
});

router.delete("/delete-account", checkAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    
    await Post.deleteMany({ creator: userId });

    const result = await user.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Account and associated posts deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Account deletion failed", error: err });
  }
});
  
module.exports = router;  