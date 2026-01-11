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
    } else if (field == 'dateOfBirth'){
        contentDiv.innerHTML = `
        <label for="bithday-start-date">BirthDay From:</label>
        <input type="date" id="bithday-start-date" name="bithday-start-date">

        <label for="bithday-end-date">BirthDay To:</label>
        <input type="date" id="bithday-end-date" name="bithday-end-date">

        `;
    } else if (field == 'weddingDay'){
        contentDiv.innerHTML = `
        <label for="wedding-start-date">Wedding Day From:</label>
        <input type="date" id="wedding-start-date" name="wedding-start-date">

        <label for="wedding-end-date">Wedding Day To:</label>
        <input type="date" id="wedding-end-date" name="wedding-end-date">

        `;
    } else {
        contentDiv.innerHTML ='';
    }
}

function handleRowClicked(target){
    console.log(target);
    const cells =    this.querySelectorAll('td');

    let state = {
        name:cells[2].textContent,
        address:cells[5].textContent
    } 
    console.log(state);
    window.electron.send('navigate-subscription',state);



}