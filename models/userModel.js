const db = require("../config/db");

class User {
  static getAll(callback) {
    db.query("SELECT * FROM users", callback);
  }

  static getByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        if (results.length === 0) {
          resolve(null);
          return;
        }
        resolve(results[0]);
      });
    });
  }

  static create(newUser, callback) {
    db.query("INSERT INTO users SET ?", newUser, callback);
  }

  static updateById(id, updatedUser, callback) {
    db.query("UPDATE users SET ? WHERE id = ?", [updatedUser, id], callback);
  }
}

module.exports = User;
