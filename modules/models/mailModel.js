const conn = require("../../config/database");

//ANCHOR - getUserId
async function getUserId(username) {
	const userIdResult = await conn.query("SELECT id FROM Users WHERE username = ?", [username]);
	if (userIdResult[0].length === 0) {
		throw new Error("User not found");
	}
	return userIdResult[0][0].id;
}

//ANCHOR - getUsernameById
async function getUsernameById(userId) {
	return await conn.query(`SELECT username FROM users WHERE id = ?`, [userId]);
}

//ANCHOR - getEmailsFromDB
async function getEmailsFromDB(userId, displayField, userRole, notDeletedBy) {
	const emails = await conn.query(
		`SELECT users.username, emails.id, emails.subject, emails.body, emails.createdAt
      FROM users JOIN emails ON users.id = emails.${displayField}
      WHERE ${notDeletedBy} = FALSE AND ${userRole} = ?
      ORDER BY emails.createdAt DESC;`,
		[userId]
	);
	return emails[0];
}

//ANCHOR - deleteEmailsFromDB
async function deleteEmailsFromDB(userId, updateField, userRole, emailIdsToDelete) {
	await conn.query(
		`UPDATE emails SET ${updateField} = TRUE WHERE ${userRole} = ? AND id IN (?)`,
		[userId, emailIdsToDelete]
	);

	await conn.query(
		`DELETE FROM emails WHERE deletedBySender = TRUE AND deletedByReceiver = TRUE`
	);

	console.log(`Emails ${updateField} query with ${userRole}: ${emailIdsToDelete}`);
}

//ANCHOR - getAllUsernames
async function getAllUsernames() {
	const users = await conn.query(`SELECT users.id, users.username FROM users`);
	return users[0];
}

//ANCHOR - addEmailToDB
async function addEmailToDB(senderId, receiverId, subject, content) {
	await conn.query(
		`INSERT INTO emails (senderId, receiverId, subject, body) VALUES (?, ?, ?, ?)`,
		[senderId, receiverId, subject, content]
	);
}

//ANCHOR - getEmailDetails
async function getEmailDetails(emailId) {
	const emailDetails = await conn.query(`SELECT * FROM emails WHERE id = ?`, [emailId]);
	console.log(emailDetails[0]);
	return emailDetails[0][0];
}

module.exports = {
	getUserId,
	getUsernameById,
	getEmailsFromDB,
	deleteEmailsFromDB,
	getAllUsernames,
	addEmailToDB,
	getEmailDetails,
};
