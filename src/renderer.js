console.log("Inside the renderer js");

let tableContentKey = [
  "familyId",
  "serialId",
  "name",
  "phoneNumber",
  "mailAddress",
  "address",
  "memberShip",
];
async function saveMember(event) {
  event.preventDefault(); // Prevent default form submission
  let submittedForm = new FormData(event.target);

  let member = {};

  submittedForm.forEach((value, key) => {
    member[key] = value;
  });

  console.log("inside save member", member);
  let response = await window.electron.send("save-member", member);
  console.log("The response is ", response);
  alert("Member added successfully");
  console.log("inside save member", member);
}

function searchMember(event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Family Id Requested to be searched is ", event);
  let submittedForm = new FormData(event.target);
  let familyId = submittedForm.get("familyId");
  let name = submittedForm.get("name");
  window.electron.send("search-users", { familyId, name });
}

window.electron.receive("search-results", (results) => {
  console.log(JSON.stringify(results));
  createTable(results);
});

function createTable(results) {
  const container = document.getElementById("results");
  const data = [
    [
      "Family Id",
      "Serial No",
      "Name",
      "Phone Number",
      "Email address",
      "Address",
      "Membership",
    ],
  ];

  if (results) {
    // Create table element
    const table = document.createElement("table");

    // Loop through data to create rows & cells
    for (let row of data) {
      let tr = document.createElement("tr");

      for (let cell of row) {
        let td = document.createElement("th");
        td.textContent = cell;
        tr.appendChild(td);
      }

      table.appendChild(tr);
    }

    for (let result of results) {
      let row = document.createElement("tr");
      for (let key of tableContentKey) {
        let content = document.createElement("td");
        content.textContent = result[key];
        row.appendChild(content);
      }
      table.appendChild(row);
    }

    // Append table to the container

    container.innerHTML = ""; // Clear previous tables
    container.appendChild(table);
  } else {
    container.innerHTML = "<h3>No Results Found</h3>";
  }
}
