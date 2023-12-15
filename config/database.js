const mysql = require("mysql2");

const conn = mysql
	.createConnection(
		{
			host: "localhost",
			user: "wpr",
			password: "fit2023",
			database: "wpr2023",
			port: 3306,
		},
		(err) => {
			if (err) {
				console.log("Error connecting to DB");
				return;
			}
			console.log("DB connected");
		}
	)
	.promise();

module.exports = conn;
