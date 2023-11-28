const express = require("express");
const router = express.Router();
const userController = require("../controllers/authenticationController");

router.get("/", (req, res) => {
	!req.cookies.user ? res.redirect("/sign-in") : res.redirect("/inbox");
});
router.get("/sign-in", userController.signInView);
router.post("/sign-in", userController.signIn);
router.get("/sign-up", userController.signUpView);
router.post("/sign-up", userController.signUp);
router.get("/sign-out", userController.signOut);

module.exports = router;
