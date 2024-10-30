const express = require("express");
const { sequelize } = require('../config/database');
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const User = require("../models/User");

const router = express.Router();

// Update user
router.put("/admin/:userId", async (req, res) => {
  try {
      const userId = req.params.userId;
      const [updated] = await User.update(
          { isAdmin: true },
          {
              where: { id: userId },
          }
      );
      if (updated) {
          const updatedUser = await User.findByPk(userId);
          return res.status(200).json({ message: "User updated successfully", user: updatedUser });
      }

      return res.status(404).json({ message: "User not found" });
  } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
  }
});


// Delete user
router.delete("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const userId = req.params.userId;
  try {
    const deleted = await User.destroy({ where: { id: userId } });
    if (deleted) {
      res.status(200).json({ message: "User has been deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Get single user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            const { password, ...others } = user.toJSON();
            res.status(200).json(others);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.findAll({ order: [["createdAt", "DESC"]], limit: 5 })
            : await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get user stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const pastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.findAll({
            attributes: [
                [sequelize.fn("MONTH", sequelize.col("createdAt")), "month"],
                [sequelize.fn("COUNT", sequelize.col("id")), "total"],
            ],
            where: {
                createdAt: {
                    [sequelize.Op.gte]: pastYear,
                },
            },
            group: ["month"],
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
