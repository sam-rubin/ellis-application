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