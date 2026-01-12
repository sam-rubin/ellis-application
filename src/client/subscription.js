window.electron.receive('state-data',(state) => {
    console.log('state received',state);
    const {name,familyId,serialId,subscriptionAmount,address} = state;
        
    document.getElementById('outputAddress').value = address;
    document.getElementById('outputName').value = name;
    document.getElementById('outputAmount').value = subscriptionAmount ? 'INR ' + subscriptionAmount : '';
    document.getElementById('familyId').value = familyId;
    document.getElementById('serialNumber').value = serialId;
        /*const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const amount = document.getElementById('amount').value;
            const month = document.getElementById('month').value;
            
            document.getElementById('outputName').value = name;
            document.getElementById('outputAddress').value = address;
            document.getElementById('outputAmount').value = amount ? '$' + amount : '';
            document.getElementById('outputMonth').value = month;
            
            document.getElementById('output').style.display = 'block';
*/

})

window.onload = () => {
    document.getElementById('printBtn').addEventListener('click',()=>{

        let amount = document.getElementById('outputAmount').value;
        amount =amount ? amount.replace("INR",""):0;
       const section = document.getElementById('output');
       const state = {
            name:document.getElementById('outputName').value,
            address:document.getElementById('outputAddress').value ,
            month:document.getElementById('month').value ,
            year:document.getElementById('year').value ,
            familyId:document.getElementById('familyId').value,
            serialId: document.getElementById('serialNumber').value, 
            amount:amount};
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
            
        }
            label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: bold;
        }
        input[type="text"],
        input[type="number"],
        select,
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 14px;
        }
        textarea {
            resize: vertical;
            min-height: 60px;
        }
        button {
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 10px;
        }
              .output {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        .output h3 {
            color: #333;
            margin-bottom: 15px;
        }
        </style>
      </head>
      <body>
      <div class="output" id="output" >
        <h2>Subscription Information</h2>
            <div class="form-group">
                <label for="outputName">Name:</label>
                <input type="text" id="outputName" value=${state.name} readonly>
            </div>
            <div class="form-group">
                <label for="month">Month:</label>
                <input type="text" id="month" value=${state.month} readonly></input>
            </div>
            <div class="form-group">
                <label for="year">Year:</label>
                <input type="text" id="year" value=${state.year} readonly></input>
            </div>
            <div class="form-group">
                <label for="outputAmount">Subscription Amount:</label>
                <input type="text" id="outputAmount" value =${amount} readonly>
            </div>
            <div class="form-group">
                <label for="familyId">Family Id</label>
                <input type="text" id="familyId" value=${state.familyId} readonly>
            </div>
            <div class="form-group">
                <label for="serialNumber">Serial Number</label>
                <input type="text" id="serialNumber" value=${state.serialId} readonly>
            </div>
    </div> 

      </body>
      </html>
    `;
    
   
       
        window.electron.send('print',{
            name:document.getElementById('outputName').value,
            address:document.getElementById('outputAddress').value ,
            month:document.getElementById('month').value ,
            year:document.getElementById('year').value ,
            familyId:document.getElementById('familyId').value,
            serialId: document.getElementById('serialNumber').value, 
            amount:amount,
            htmlContent

        });
    })
}