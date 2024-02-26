// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatgpt_api",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

// Create Express app
const app = express();

// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes
app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    res.json({ success: true, message: "Data fetched successfully", data: results });
  });
});

app.post("/register", async (req, res) => {
  const { full_name, email, mobile_number, address, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
    connection.query(
      "INSERT INTO users (full_name, email, mobile_number, address, password) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, mobile_number, address, hashedPassword], // Store the hashed password
      (error, results) => {
        if (error) throw error;
        res.send("User added successfully");
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error registering user");
  }
});

// Define login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user data from the database based on the provided email
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
          res.status(401).json({ success: false, message: "User not found" });
          return;
        }

        // Compare the provided password with the hashed password stored in the database
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          res.status(401).json({ success: false, message: "Incorrect password" });
          return;
        }

        // Passwords match, user is authenticated
        delete user.password
        res.json({ success: true, message: "Login successful", user: user });
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error logging in");
  }
});


// Define update route
app.put("/api/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { full_name, email, mobile_number, address, password } = req.body;

  try {
    // Check if the user exists
    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [userId],
      async (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
          res.status(404).json({ success: false, message: "User not found" });
          return;
        }

        // Update user information
        connection.query(
          "UPDATE users SET full_name = ?, email = ?, mobile_number = ?, address = ?, password = ? WHERE id = ?",
          [full_name, email, mobile_number, address, password, userId],
          (error, results) => {
            if (error) throw error;
            res.json({ success: true, message: "User updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error updating user");
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
