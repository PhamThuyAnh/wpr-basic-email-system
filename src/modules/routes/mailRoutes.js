const express = require("express");
const router = express.Router();
const mailController = require("../controllers/mailController");

const isAlreadySignedIn = (req, res, next) => {
	if (req.cookies.user) {
		next();
	} else {
		res.status(403).render("error", { error: "403" });
	}
};

router.use(["/inbox", "/outbox", "/compose", "/email-detail/:emailId"], isAlreadySignedIn);

router.get("/inbox", mailController.inboxView);
router.get("/outbox", mailController.outboxView);
router.post("/delete-inbox-emails", mailController.deleteInboxEmails);
router.post("/delete-outbox-emails", mailController.deleteOutboxEmails);
router.get("/compose", mailController.composeView);
router.post("/send-email", mailController.sendEmail);
router.get("/email-detail/:emailId", mailController.emailDetailView);

module.exports = router;
