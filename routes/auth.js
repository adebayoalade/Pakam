const express = require("express");
const router = express.Router();

const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//signup
router.post("/signup", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: cryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC,
        ).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        } catch (error) {
            res.status(500).json(error);
    }
});

//Login
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({
        username: req.body.username,
      });
  
      !user && res.status(401).json("Wrong Username");
  
      const hashedPassword = cryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC,
      );
  
      const OriginalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);
  
      OriginalPassword !== req.body.password &&
        res.status(401).json("Wrong Password");
  
      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
        {
          expiresIn: "3d",
        }
      );
  
      const { password, ...others } = user._doc;
  
      res.status(200).json({ ...others, accessToken });
    } catch (error) {
      res.status(500).json(error);
    }
  });