const {
	getUserId,
	getUsernameById,
	getEmailsFromDB,
	deleteEmailsFromDB,
	getAllUsernames,
	addEmailToDB,
	getEmailDetails,
} = require("./../models/mailModel");

//ANCHOR - display emails
async function displayEmails(req, res, box) {
	const username = req.cookies.user;
	if (!username) res.status(403).render("error", { error: "403" });

	try {
		const userId = await getUserId(username);
		let displayField, userRole, notDeletedBy;

		if (box === "inbox") {
			displayField = "senderId";
			userRole = "receiverId";
			notDeletedBy = "deletedByReceiver";
		}

		if (box === "outbox") {
			displayField = "receiverId";
			userRole = "senderId";
			notDeletedBy = "deletedBySender";
		}

		const displayEmails = await getEmailsFromDB(userId, displayField, userRole, notDeletedBy);

		res.render(`${box}`, {
			params: { username: username },
			msg: "This box is empty. There is no email to display",
			emails: displayEmails,
			totalPages: Math.ceil(displayEmails.length / 5),
			req: req,
		});
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

//ANCHOR - delete emails
async function deleteEmails(req, res, box) {
	const username = req.cookies.user;
	try {
		const userId = await getUserId(username);
		const emailIdsToDelete = req.body.emailIds;

		let updateField;
		let userRole;

		if (box === "inbox") {
			updateField = "deletedByReceiver";
			userRole = "receiverId";
		}

		if (box === "outbox") {
			updateField = "deletedBySender";
			userRole = "senderId";
		}

		deleteEmailsFromDB(userId, updateField, userRole, emailIdsToDelete);

		res.json({ success: true });
	} catch (error) {
		console.error("Error deleting emails:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

async function inboxView(req, res) {
	displayEmails(req, res, "inbox");
}

async function outboxView(req, res) {
	displayEmails(req, res, "outbox");
}

async function deleteInboxEmails(req, res) {
	deleteEmails(req, res, "inbox");
}

async function deleteOutboxEmails(req, res) {
	deleteEmails(req, res, "outbox");
}

//ANCHOR - render compose view
async function composeView(req, res) {
	res.render("compose", {
		params: { username: req.cookies.user },
		users: await getAllUsernames(),
		msg: "",
	});
}

//ANCHOR - send email
async function sendEmail(req, res) {
	const username = req.cookies.user;
	try {
		const senderId = await getUserId(username);
		let { email_recipient, email_subject, email_content } = req.body;

		let msg = "Email sent successfully.";
		if (!email_subject && !email_content) {
			msg = "Email sent without subject and content.";
		} else if (!email_subject) {
			msg = "Email sent without subject.";
		} else if (!email_content) {
			msg = "Email sent without content.";
		}

		if (!email_subject) email_subject = "(no subject)";
		if (!email_content) email_content = "(no content)";

		console.log(
			"\nFrom: " + senderId,
			"\nTo: " + email_recipient,
			"\nSubject: " + email_subject,
			"\nContent: " + email_content
		);

		addEmailToDB(senderId, email_recipient, email_subject, email_content);

		res.render("compose", {
			params: { username: req.cookies.user },
			users: await getAllUsernames(),
			msg: msg,
		});
	} catch (error) {
		console.error("Error sending emails:", error);
	}
}

//ANCHOR - view email detail
async function emailDetailView(req, res) {
	const emailId = parseFloat(req.params.emailId);

	const emailsDetails = await getEmailDetails(emailId);
	const senderName = await getUsernameById(emailsDetails.senderId);
	const receiverName = await getUsernameById(emailsDetails.receiverId);
	const subject = emailsDetails.subject;
	const content = emailsDetails.body;
	const createdAt = emailsDetails.createdAt;
	const time = new Date(createdAt);

	let email = {
		senderName: senderName[0][0].username,
		receiverName: receiverName[0][0].username,
		subject: subject,
		content: content,
		time: time,
	};
	console.log(email);

	res.render("email-detail", {
		params: { username: req.cookies.user },
		email: email,
	});
}

module.exports = {
	inboxView,
	outboxView,
	deleteInboxEmails,
	deleteOutboxEmails,
	composeView,
	sendEmail,
	emailDetailView,
};
