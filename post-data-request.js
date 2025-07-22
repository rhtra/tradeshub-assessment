const dataToSend = {
    "address": "100 New Lane",
    "suburb": "SuburbB",
    "salePrice": 620000,
    "description": "Spacious home with a garden"
};

fetch('http://localhost:3000/addProperty', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));