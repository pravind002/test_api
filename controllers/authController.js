const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.getByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, message: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({ success: false, message: "Incorrect password" });
        return;
      }

      delete user.password;
      res.json({ success: true, message: "Login successful", user });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Error logging in");
    }
  },
};

module.exports = AuthController;
