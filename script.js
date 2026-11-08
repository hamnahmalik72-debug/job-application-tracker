const addApplicationButton =
    document.querySelector("#addApplicationButton");

const applicationForm =
    document.querySelector("#applicationForm");

const formTitle =
    document.querySelector("#formTitle");

const companyInput =
    document.querySelector("#companyInput");

const roleInput =
    document.querySelector("#roleInput");

const statusInput =
    document.querySelector("#statusInput");

const dateInput =
    document.querySelector("#dateInput");

const notesInput =
    document.querySelector("#notesInput");

const saveButton =
    document.querySelector("#saveButton");

const cancelButton =
    document.querySelector("#cancelButton");

const searchInput =
    document.querySelector("#searchInput");

const filterStatus =
    document.querySelector("#filterStatus");

const applicationsTableBody =
    document.querySelector("#applicationsTableBody");

const totalCount =
    document.querySelector("#totalCount");

const interviewCount =
    document.querySelector("#interviewCount");

const offerCount =
    document.querySelector("#offerCount");

const rejectedCount =
    document.querySelector("#rejectedCount");


// LocalStorage se purana data uthao
let applications =
    JSON.parse(localStorage.getItem("applications")) || [];


// Agar edit ho raha ho to id yahan save hogi
let editingId = null;



function saveToLocalStorage() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );

}



function getStatusClass(status) {

    if (status === "Applied") {
        return "applied";
    }

    if (status === "Interview") {
        return "interview";
    }

    if (status === "Offer") {
        return "offer";
    }

    if (status === "Rejected") {
        return "rejected";
    }

    return "";

}



function updateDashboard() {

    totalCount.textContent = applications.length;


    const interviewApplications =
        applications.filter(function (application) {

            return application.status === "Interview";

        });


    const offerApplications =
        applications.filter(function (application) {

            return application.status === "Offer";

        });


    const rejectedApplications =
        applications.filter(function (application) {

            return application.status === "Rejected";

        });


    interviewCount.textContent =
        interviewApplications.length;

    offerCount.textContent =
        offerApplications.length;

    rejectedCount.textContent =
        rejectedApplications.length;

}



function renderApplications() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedStatus =
        filterStatus.value;


    const filteredApplications =
        applications.filter(function (application) {

            const matchesSearch =
                application.company
                    .toLowerCase()
                    .includes(searchText)

                ||

                application.role
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =
                selectedStatus === "All"

                ||

                application.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    applicationsTableBody.innerHTML = "";


    if (filteredApplications.length === 0) {

        applicationsTableBody.innerHTML = `

            <tr>

                <td colspan="6" class="empty-message">

                    No applications found.

                </td>

            </tr>

        `;

        return;

    }


    filteredApplications.forEach(function (application) {

        const row =
            document.createElement("tr");


        const statusClass =
            getStatusClass(application.status);


        row.innerHTML = `

            <td>
                ${application.company}
            </td>

            <td>
                ${application.role}
            </td>

            <td>

                <span class="status ${statusClass}">

                    ${application.status}

                </span>

            </td>

            <td>
                ${application.date}
            </td>

            <td>
                ${application.notes || "-"}
            </td>

            <td>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        data-id="${application.id}"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        data-id="${application.id}"
                    >
                        Delete
                    </button>

                </div>

            </td>

        `;


        applicationsTableBody.appendChild(row);

    });

}



function clearForm() {

    companyInput.value = "";

    roleInput.value = "";

    statusInput.value = "Applied";

    dateInput.value = "";

    notesInput.value = "";

    editingId = null;

    formTitle.textContent =
        "Add New Application";

    saveButton.textContent =
        "Save Application";

}



function openAddForm() {

    clearForm();

    applicationForm.style.display = "block";

}



function closeForm() {

    applicationForm.style.display = "none";

    clearForm();

}



addApplicationButton.addEventListener(
    "click",
    function () {

        openAddForm();

    }
);



cancelButton.addEventListener(
    "click",
    function () {

        closeForm();

    }
);



saveButton.addEventListener(
    "click",
    function () {

        const company =
            companyInput.value.trim();

        const role =
            roleInput.value.trim();

        const status =
            statusInput.value;

        const date =
            dateInput.value;

        const notes =
            notesInput.value.trim();


        if (
            company === ""
            ||
            role === ""
            ||
            date === ""
        ) {

            alert(
                "Please fill Company, Role and Date."
            );

            return;

        }


        if (editingId === null) {

            const newApplication = {

                id: Date.now(),

                company: company,

                role: role,

                status: status,

                date: date,

                notes: notes

            };


            applications.push(newApplication);

        }

        else {

            const application =
                applications.find(
                    function (application) {

                        return application.id === editingId;

                    }
                );


            application.company = company;

            application.role = role;

            application.status = status;

            application.date = date;

            application.notes = notes;

        }


        saveToLocalStorage();

        updateDashboard();

        renderApplications();

        closeForm();

    }
);



applicationsTableBody.addEventListener(
    "click",
    function (event) {

        const clickedElement =
            event.target;


        if (
            clickedElement.classList.contains(
                "delete-btn"
            )
        ) {

            const id =
                Number(
                    clickedElement.dataset.id
                );


            const shouldDelete =
                confirm(
                    "Delete this application?"
                );


            if (!shouldDelete) {
                return;
            }


            applications =
                applications.filter(
                    function (application) {

                        return application.id !== id;

                    }
                );


            saveToLocalStorage();

            updateDashboard();

            renderApplications();

        }


        if (
            clickedElement.classList.contains(
                "edit-btn"
            )
        ) {

            const id =
                Number(
                    clickedElement.dataset.id
                );


            const application =
                applications.find(
                    function (application) {

                        return application.id === id;

                    }
                );


            if (!application) {
                return;
            }


            editingId =
                application.id;


            companyInput.value =
                application.company;

            roleInput.value =
                application.role;

            statusInput.value =
                application.status;

            dateInput.value =
                application.date;

            notesInput.value =
                application.notes;


            formTitle.textContent =
                "Edit Application";

            saveButton.textContent =
                "Update Application";


            applicationForm.style.display =
                "block";

        }

    }
);



searchInput.addEventListener(
    "input",
    function () {

        renderApplications();

    }
);



filterStatus.addEventListener(
    "change",
    function () {

        renderApplications();

    }
);



updateDashboard();

renderApplications();