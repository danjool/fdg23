const express = require('express') 
const path = require('path')
const app = express() 

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Listening on port ${port}`))

// app.use( require("./routes") )
app.use("/nodes", require("./routes/nodes") )
app.use("/edges", require("./routes/edges") )

app.use(express.static(path.join(__dirname, 'react-app', 'build')))