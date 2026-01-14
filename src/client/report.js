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