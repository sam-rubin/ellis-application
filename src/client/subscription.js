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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Subscription Summary</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: "Segoe UI", Tahoma, sans-serif;
            background: linear-gradient(135deg, #667eea, #764ba2);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .summary-card {
            background: #ffffff;
            width: 420px;
            padding: 30px 35px;
            border-radius: 16px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        }

        .summary-title {
            text-align: center;
            font-size: 26px;
            font-weight: bold;
            color: #4a00e0;
            margin-bottom: 30px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 14px 0;
            border-bottom: 1px dashed #ddd;
        }

        .summary-row:last-child {
            border-bottom: none;
        }

        .label {
            font-weight: 600;
            color: #333;
            letter-spacing: 0.5px;
        }

        .value {
            font-weight: 500;
            color: #ff5722;
        }

        .highlight {
            background: linear-gradient(90deg, #ff8a00, #e52e71);
            color: #ffffff;
            padding: 12px;
            border-radius: 10px;
            text-align: center;
            font-size: 18px;
            margin-top: 25px;
        }
    </style>
</head>
<body>

    <div class="summary-card">
        <div class="summary-title">Subscription Summary</div>

        <div class="summary-row">
            <div class="label">Subscription for</div>
            <div class="label">Month ${state.month}  Year ${state.year}</div>
        </div>

        <div class="summary-row">
            <div class="label">Name</div>
            <div class="value">${state.name}</div>
        </div>

        <div class="summary-row">
            <div class="label">Family ID</div>
            <div class="value">${state.familyId}</div>
        </div>

        <div class="summary-row">
            <div class="label">Serial Number</div>
            <div class="value">${state.serialId}</div>
        </div>

        <div class="highlight">
            Amount : ₹ ${state.amount}
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