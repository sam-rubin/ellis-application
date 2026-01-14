console.log("Inside the renderer js");

let tableContentKey = [
  "familyId",
  "serialId",
  "name",
  "phoneNumber",
  "mailAddress",
  "address",
  "memberShip",
  "subscription_amount"
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
}

window.electron.receive("registration-response",(response) =>{
  console.log('Registration Response is ',response);
  if(response === 'error'){
      alert("Member Registration Failed");
  } else {
      alert("Member has been Registered Successfully");
  }

});

function searchMember(event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Family Id Requested to be searched is ", event);
  let submittedForm = new FormData(event.target);
  let familyId = submittedForm.get("familyId");
  let name = submittedForm.get("name");
  let birthDayStartDate = submittedForm.get("bithday-start-date");
  let birthDayEndDate = submittedForm.get("bithday-end-date");
  let weddingStartDate = submittedForm.get("wedding-start-date");
  let weddingEndDate = submittedForm.get("wedding-end-date");
  let ageGreater = submittedForm.get("ageGreater");
  let subscriptionPercentage = submittedForm.get("subscriptionPercentage");
  

  let searchBy = submittedForm.get("searchBy");
  console.log('search by ',searchBy);
  window.electron.send("search-users", { familyId, name,birthDayEndDate,birthDayStartDate,weddingEndDate,weddingStartDate,searchBy,ageGreater,subscriptionPercentage });
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
      "Subscription"
    ],
  ];

  if (results && results.length > 0) {
    const table = document.createElement("table");
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
        content.textContent = result["dataValues"][key];
        row.appendChild(content);
      }
      row.addEventListener('click',handleRowClicked)
      
      table.appendChild(row);
    }

    container.innerHTML = ""; 
    container.appendChild(table);
  } else {
    container.innerHTML = "<h3>No Results Found</h3>";
  }
}