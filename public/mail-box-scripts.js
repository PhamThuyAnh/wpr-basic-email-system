"use strict";

(function () {
	window.addEventListener("load", () => {
		//ANCHOR - pagination function: display 5 emails per page
		const emailsPerPage = 5;
		let currentPage = 1;
		let totalPages;

		const prevButton = document.getElementById("prev-button");
		const nextButton = document.getElementById("next-button");

		function updatePage() {
			const emailRows = document.querySelectorAll(".mails tbody tr");

			if (emailRows.length === 0) {
				document.querySelector(".tools").style.display = "none";
				document.querySelector(".mails").style.display = "none";
				document.querySelector(".pagination").style.display = "none";
				document.querySelector(".empty-msg").style.display = "block";
				updatePage();
			} else {
				document.querySelector(".empty-msg").style.display = "none";
			}

			totalPages = Math.ceil(emailRows.length / emailsPerPage);
			emailRows.forEach((email, index) => {
				if (Math.ceil((index + 1) / emailsPerPage) === currentPage) {
					email.classList.remove("hide");
				} else {
					email.classList.add("hide");
				}
			});

			document.querySelectorAll(".page-button").forEach((button) => {
				button.remove();
			});

			for (let i = 1; i <= totalPages; i++) {
				const button = document.createElement("button");
				button.classList.add("page-button");
				button.dataset.page = i;
				button.textContent = i;

				button.addEventListener("click", function () {
					currentPage = parseInt(this.dataset.page);
					updatePage();
				});

				if (i === currentPage) {
					button.classList.add("active");
				}
				document.querySelector(".pagination").insertBefore(button, nextButton);
			}
			prevButton.disabled = currentPage === 1;
			nextButton.disabled = currentPage === totalPages;
		}

		prevButton.addEventListener("click", function () {
			if (currentPage > 1) {
				currentPage--;
				updatePage();
			}
		});

		nextButton.addEventListener("click", function () {
			if (currentPage < totalPages) {
				currentPage++;
				updatePage();
			}
		});

		//ANCHOR - function for select-all checkbox button
		const selectAllCheckbox = document.getElementById("select-all-btn");
		const checkboxes = document.querySelectorAll(".checkboxes");

		checkboxes.forEach((checkbox) => {
			checkbox.addEventListener("change", function () {
				const isChecked = this.checked;
				const row = this.closest("tr");
				const cells = row.querySelectorAll("td");

				cells.forEach((cell) => {
					if (isChecked) {
						cell.classList.add("selected");
					} else {
						cell.classList.remove("selected");
					}
				});
			});
		});

		selectAllCheckbox.addEventListener("click", function () {
			const isChecked = this.checked;
			checkboxes.forEach((checkbox) => {
				checkbox.checked = isChecked;
				const row = checkbox.closest("tr");
				const cells = row.querySelectorAll("td");

				cells.forEach((cell) => {
					if (isChecked) {
						cell.classList.add("selected");
					} else {
						cell.classList.remove("selected");
					}
				});
			});
		});

		//ANCHOR - delete-emails button
		const inboxDeleteBtn = document.getElementById("inbox-delete-btn");
		const outboxDeleteBtn = document.getElementById("outbox-delete-btn");

		if (inboxDeleteBtn) {
			inboxDeleteBtn.addEventListener("click", () => deleteSelectedEmails("inbox"));
		}
		if (outboxDeleteBtn) {
			outboxDeleteBtn.addEventListener("click", () => deleteSelectedEmails("outbox"));
		}

		async function deleteSelectedEmails(action) {
			console.log(`Delete button clicked for ${action}`);

			const selectedEmailIds = Array.from(
				document.querySelectorAll(".checkboxes:checked")
			).map((checkbox) => checkbox.id.split("_")[1]);

			console.log("Selected email IDs:", selectedEmailIds);

			if (selectedEmailIds.length === 0) {
				alert("Please select at least one email to delete.");
				return;
			}

			try {
				const response = await fetch(`/delete-${action}-emails`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ emailIds: selectedEmailIds }),
				});

				if (response.ok) {
					selectedEmailIds.forEach((emailId) => {
						const emailRow = document.getElementById("email_" + emailId);
						if (emailRow) {
							emailRow.remove();
						}
					});
					console.log(`Delete OK for ${action}`);

					totalPages = Math.ceil(
						document.querySelectorAll(".mails tbody tr").length / emailsPerPage
					);

					// if the current page is greater than the total number of pages,
					// set the current page to the last page
					if (currentPage > totalPages) {
						currentPage = totalPages;
					}

					updatePage();
				} else {
					console.error(`Failed to delete ${action} emails:`, response.statusText);
				}
			} catch (error) {
				console.error("Error during fetch:", error);
			}
		}
		updatePage();
	});
})();
