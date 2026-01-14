function searchBy(target){
    console.log('Target is ',target.target.value);
    const field = target.target.value;
    const contentDiv =document.getElementById("content");
    console.log(contentDiv);
    if(field =="name"){
     contentDiv.innerHTML = `<label for="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter your full name"
        />`;
    } else if(field =="familyId"){
        contentDiv.innerHTML = `
         <label for="familyId">Family Id</label>
        <input
          type="text"
          id="familyId"
          name="familyId"
          placeholder="Enter the Family Identifier"
        />
        `;
    } else if (field == 'subscriptionDate'){
        contentDiv.innerHTML = `
        <label for="start-date">Subscription Collected From:</label>
        <input type="date" id="start-date" name="start-date">

        <label for="end-date">Subscription Collected To:</label>
        <input type="date" id="end-date" name="end-date">
        `;
    }  else {
        contentDiv.innerHTML ='';
    }
}

let tableContentKey = [
  "familyId",
  "serialId",
  "subMonth",
  "subYear",
  "amount",
  "paidDate"
];

function loadReport(event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Family Id Requested to be searched is ", event);
  let submittedForm = new FormData(event.target);
  let familyId = submittedForm.get("familyId");
  let name = submittedForm.get("name");
  let startDate = submittedForm.get("start-date");
  let endDate = submittedForm.get("end-date");
  let searchBy = submittedForm.get("reportBy");
  console.log('search by ',searchBy);
  window.electron.send("load-report", { familyId, name,startDate,endDate,searchBy });
}
window.electron.receive("subscription-report",(results)=>{
  console.log("Response is ",JSON.stringify(results));
  createTable(results);
})

function createTable(results) {
  const container = document.getElementById("results");
  const data = [
    [
      "Family Id",
      "Serial No",
      "Subscription Month",
      "Subscription Year",
      "Subscription Amount",
      "Paid Year"
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
    let totalAmount =0;
    for (let result of results) {
      let row = document.createElement("tr");
      for (let key of tableContentKey) {
        let content = document.createElement("td");
        content.textContent = result["dataValues"][key];
        row.appendChild(content);
      }
    
      totalAmount += result["dataValues"]["amount"];
      table.appendChild(row);
    }

    container.innerHTML = ""; 
    container.appendChild(table);
    let h2 = document.createElement("h2");
    h2.textContent = `Total Amount Collected ${totalAmount}`
    container.appendChild(h2);
  } else {
    container.innerHTML = "<h3>No Results Found</h3>";
  }
}