// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

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

app.post("/register", (req, res) => {
    const { full_name, email, mobile_number, address, password } = req.body; // Change mobile_number_address to mobile_number
    connection.query(
      "INSERT INTO users (full_name, email, mobile_number, address, password) VALUES (?, ?, ?, ?, ?)",
      [full_name, email, mobile_number, address, password],
      (error, results) => {
        if (error) throw error;
        res.send("User added successfully");
      }
    );
  });
  

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
