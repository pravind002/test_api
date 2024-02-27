const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const UserController = {
  getAllUsers: (req, res) => {
    User.getAll((error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
        return;
      }
      res.json({ success: true, message: "Data fetched successfully", data: results });
    });
  },

  createUser: async (req, res) => {
    const { full_name, email, mobile_number, address, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      User.create({ full_name, email, mobile_number, address, password: hashedPassword }, (error, results) => {
        if (error) {
          console.error("Error:", error);
          res.status(500).json({ success: false, message: "Error registering user" });
          return;
        }
        res.json({ success: true, message: "User added successfully" });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error registering user");
    }
  },

  updateUser: (req, res) => {
    const userId = req.params.id;
    const { full_name, email, mobile_number, address, password } = req.body;
    User.updateById(userId, { full_name, email, mobile_number, address, password }, (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Error updating user" });
        return;
      }
      res.json({ success: true, message: "User updated successfully" });
    });
  },
};

module.exports = UserController;
