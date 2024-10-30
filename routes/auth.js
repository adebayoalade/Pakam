const express = require("express");
const router = express.Router();

const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


//signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
      // Check if the user already exists
      const existingUser = await User.findOne({
          where: { username }
      });

      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password before saving it
      const hashedPassword = cryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

      // Create a new user
      const newUser = await User.create({
          username,
          email,
          password: hashedPassword,
          isAdmin: false // Set this as needed
      });

      // Exclude the password from the response
      const { password: _, ...others } = newUser.get({ plain: true });

      res.status(201).json({ message: 'User registered successfully', user: others });
  } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


//Login
router.post("/login", async (req, res) => {
  try {
      const user = await User.findOne({
          where: {
              username: req.body.username,
          },
      });

      // Check if user exists
      if (!user) {
          return res.status(401).json("Wrong Username");
      }

      // Decrypt the password
      const hashedPassword = cryptoJS.AES.decrypt(
          user.password,
          process.env.PASS_SEC,
      );

      const OriginalPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

      // Check if the password matches
      if (OriginalPassword !== req.body.password) {
          return res.status(401).json("Wrong Password");
      }

      // Create access token
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

      // Destructure user data to exclude the password
      const { password, ...others } = user.dataValues;

      // Send response with user data and access token
      res.status(200).json({ ...others, accessToken });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json("Internal Server Error");
  }
});


  module.exports = router;