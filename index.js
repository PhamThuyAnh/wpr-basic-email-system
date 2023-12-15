const express = require("express");
const cookieParser = require("cookie-parser");
const authenticationRoutes = require("./modules/routes/authenticationRoutes");
const mailRoutes = require("./modules/routes/mailRoutes");

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("views", [
	__dirname + "/views",
	__dirname + "/views/authentication",
	__dirname + "/views/mail",
]);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", authenticationRoutes);
app.use("/", mailRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}/`);
});
