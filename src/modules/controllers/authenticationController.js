const {
	usnExisted,
	emailExisted,
	checkAuth,
	addUser,
	validateEmail,
} = require("./../models/authenticationModel");

//ANCHOR - render sign-in view
async function signInView(req, res) {
	res.render("sign-in", {
		params: { username: req.cookies.user },
		error: {},
		msg: req.query.msg || "",
	});
}

//ANCHOR - sign-in user func
async function signIn(req, res) {
	const { username, password } = req.body;
	let mistakes = {};

	if (!username) {
		mistakes.username = "Please enter your username!";
	} else if (!(await usnExisted(username))) {
		mistakes.username = "This username does not exist!";
	}

	if (!password) {
		mistakes.password = "Please enter your password!";
	} else if (!(await checkAuth(username, password))) {
		mistakes.password = "Wrong Password!";
	}

	if (Object.keys(mistakes).length === 0) {
		res.cookie("user", username, { maxAge: 60000 });
		res.redirect("/inbox");
	} else {
		res.render("sign-in", {
			error: mistakes,
			params: req.body || "",
			msg: "",
		});
	}
}

//ANCHOR - render sign-up view
async function signUpView(req, res) {
	res.render("sign-up", {
		error: {},
		params: {},
	});
}

//ANCHOR - sign-up user func
async function signUp(req, res) {
	let { username, email, password, re_password } = req.body;
	let mistakes = {};

	if (!username) {
		mistakes.username = "Username is missing!";
	} else if (await usnExisted(username)) {
		mistakes.username = "This username already exists!";
	}

	if (!email) {
		mistakes.email = "Email is missing!";
	} else if (!validateEmail(email)) {
		mistakes.email = "Email is not valid!";
	} else if (await emailExisted(email)) {
		mistakes.email = "This email is already registered!";
	}

	if (!password) {
		mistakes.password = "Please enter your password!";
	} else if (password.length < 6) {
		mistakes.password = "Password must contain at least 6 characters!";
	}

	if (!re_password) {
		mistakes.re_password = "Please re-enter your password!";
	} else if (password !== re_password) {
		mistakes.re_password = "Passwords do not matched!";
	}

	if (Object.keys(mistakes).length === 0) {
		addUser(username, email, password);
		res.cookie("user", username, { maxAge: 60000 });
		res.redirect("/sign-in?msg=New account is created successfully!");
	} else {
		res.render("sign-up", {
			error: mistakes,
			params: req.body,
		});
	}
}

//ANCHOR - sign-up user func
async function signOut(req, res) {
	res.clearCookie("user");
	res.redirect("/sign-in?msg=Sign-out successfully!");
}

module.exports = {
	signInView,
	signIn,
	signUpView,
	signUp,
	signOut,
};
