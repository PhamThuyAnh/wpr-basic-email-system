const mysql = require("mysql2/promise");

async function main() {
	try {
		const conn = await mysql.createConnection({
			host: "localhost",
			user: "wpr",
			password: "fit2023",
			port: 3306,
		});

		await conn.query("CREATE DATABASE IF NOT EXISTS wpr2023");
		await conn.query("USE wpr2023");

		await conn.query("DROP TABLE IF EXISTS Emails");
		await conn.query("DROP TABLE IF EXISTS Users");

		//ANCHOR - create tables
		const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              username VARCHAR(225) NOT NULL UNIQUE,
              email VARCHAR(255) NOT NULL,
              password VARCHAR(255) NOT NULL
            )`;
		await conn.query(createUsersTable);

		const createEmailsTable = `
            CREATE TABLE IF NOT EXISTS emails (
              id INT AUTO_INCREMENT PRIMARY KEY,
              senderId INT NOT NULL,
              receiverId INT NOT NULL,
              subject VARCHAR(255),
              body TEXT,
              createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deletedBySender BOOLEAN DEFAULT false,
              deletedByReceiver BOOLEAN DEFAULT false,
              FOREIGN KEY (senderId) REFERENCES Users(id),
              FOREIGN KEY (receiverId) REFERENCES Users(id)
            );`;

		await conn.query(createEmailsTable);

		//ANCHOR - initialize data
		const users = [
			["a", "a@a.com", "123123"],
			["Rosalyne-Kruzchka Lohefalter", "signora@gmail.com", "123123"],
			["Furina de Fontaine", "furina@gmail.com", "123123"],
			["Neuvillette", "neuvillette@gmail.com", "123123"],
			["Wriothesley", "wriothesley@gmail.com", "123123"],
		];

		const emails = [
			[
				2,
				1,
				`1 Greetings from Friend and Conversation Companion`,
				`I hope this email finds you well. I am writing to request a meeting with you to discuss the new project we are working on. I would like to discuss the project timeline, budget, and any other relevant details.`,
			],
			[
				3,
				1,
				`2 Greetings from Friend and Conversation Companion`,
				`I hope this email finds you well. I am writing to request a meeting with you to discuss the new project we are working on. I would like to discuss the project timeline, budget, and any other relevant details.`,
			],
			[
				4,
				1,
				`3 Greetings from Friend and Conversation Companion`,
				`I hope this email finds you well. I am writing to request a meeting with you to discuss the new project we are working on. I would like to discuss the project timeline, budget, and any other relevant details.`,
			],
			[
				4,
				1,
				`4 Greetings from Friend and Conversation Companion`,
				`I hope this email finds you well. I am writing to request a meeting with you to discuss the new project we are working on. I would like to discuss the project timeline, budget, and any other relevant details.`,
			],
			[
				2,
				1,
				`5 Greetings from Friend and Conversation Companion`,
				`I hope this email finds you well. I am writing to request a meeting with you to discuss the new project we are working on. I would like to discuss the project timeline, budget, and any other relevant details.`,
			],
			[
				4,
				1,
				`Well Wishes for a Speedy Recovery and Sending Healing Energy`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				3,
				1,
				`Offering a Helping Hand and Extending Friendship`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				4,
				1,
				`Sharing Exciting Updates and Spreading Joy`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				2,
				1,
				`Thoughtful Message Expressing Appreciation and Gratitude`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				4,
				1,
				`Well Wishes for a Speedy Recovery and Sending Healing Energy`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				1,
				2,
				`Extending a Warm Greeting`,
				`I hope this email finds you well. Just a quick reminder about the team meeting tomorrow at 10am. Looking forward to seeing you there!`,
			],
			[
				1,
				3,
				`A Warm Welcome and Eagerness to Connect`,
				`Dear Rosalyne-Kruzchka Lohefalter, Prepare to be captivated by the enchanting world of Genshin Impact, where boundless exploration, exhilarating battles, and captivating quests await. Embark on a journey filled with captivating characters, awe-inspiring landscapes, and countless mysteries to unravel.`,
			],
			[
				2,
				3,
				`Reaching Out to Establish Rapport and Collaboration`,
				`Dear Team, I hope this email finds you well. I wanted to share some important updates regarding Project X. As you may know, we've been making significant progress over the past few months. However, we've encountered a few challenges that need our immediate attention.`,
			],
			[
				4,
				2,
				`Words of Encouragement to Brighten Your Day`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				2,
				4,
				`Checking In, Reminiscing, and Cherishing Past Conversations`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				1,
				3,
				`Sincere Apology and Acknowledgment of Mistakes`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				1,
				2,
				`Invitation to Collaborate and Join Forces on Exciting Projects`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				3,
				4,
				`Request for Assistance and Eagerness to Learn`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				1,
				3,
				`Expression of Heartfelt Gratitude and Appreciation`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				2,
				3,
				`Congratulations on Your Success and Celebration of Achievements`,
				`Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
			[
				1,
				2,
				`Extending a Warm Greeting`,
				`Dear Furina de Fontaine, I can't wait to explore the vast expanse of Teyvat with you by my side. Together, we'll conquer challenging domains, decipher intricate puzzles, and unearth hidden treasures that lie dormant within this magical realm. Lorem ipsum dolor sit amet. Sed ipsa ipsa ea voluptas molestiae eos atque quidem? Sit inventore dolor sit vitae deleniti ex enim necessitatibus 33 incidunt itaque in molestiae harum et eligendi iusto sit ipsa consectetur.`,
			],
		];

		// ANCHOR - insert data
		const insertUserQuery = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
		const insertEmailQuery =
			"INSERT INTO Emails (senderId, receiverId, subject, body) VALUES (?, ?, ?, ?)";

		for (const user of users) {
			await conn.query(insertUserQuery, user);
		}

		for (const email of emails) {
			await conn.query(insertEmailQuery, email);
		}

		console.log("Data initialized.");
		await conn.end();
	} catch (error) {
		console.error("Error:", error);
	}
}

main();
