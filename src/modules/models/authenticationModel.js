const conn = require('../../config/database');

//ANCHOR - check if username existed
async function usnExisted(username) {
   const [rows] = await conn.query(
      `SELECT * FROM users WHERE BINARY username = ?`,
      [username]
   );
   return rows.length > 0;
}

//ANCHOR - check if email existed
async function emailExisted(email) {
   const [rows] = await conn.query(
      `SELECT * FROM users WHERE BINARY email = ?`,
      [email]
   );
   return rows.length > 0;
}

//ANCHOR - check if sign-in info is correct
async function checkAuth(username, password) {
   if (await usnExisted(username)) {
      const [rows] = await conn.query(
         `SELECT * FROM users WHERE BINARY username = ? AND BINARY password = ?`,
         [username, password]
      );
      return rows.length > 0;
   }
}

//ANCHOR - add new user
async function addUser(username, email, password) {
   await conn.query(
      `INSERT INTO users (username, email, password) VALUES (?,?,?)`,
      [username, email, password]
   );
}

//ANCHOR - validate email
function validateEmail(email) {
   var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
   return regex.test(email);
}

module.exports = {
   usnExisted,
   emailExisted,
   checkAuth,
   addUser,
   validateEmail
};