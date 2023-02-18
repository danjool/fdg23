const express = require('express'); 
const path = require('path')
const app = express(); 
const port = process.env.PORT || 80;

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});

app.use(express.static(path.join(__dirname, 'react-app', 'build')));