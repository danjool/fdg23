const express = require('express') 
const path = require('path')
const app = express() 
const SQL = require('sql-template-strings')
const { Client } = require('pg')

const port = process.env.PORT || 8000
const dbhost = process.env.DBHOST || '35.212.167.150'
const dbuser = process.env.DBUSER || 'postgres'
const dbpassword = process.env.DBPASSWORD || ''
const dbport = process.env.DBPORT || 5432

console.log("dbpassword", dbpassword)

const client = new Client({
    host: dbhost,
    user: dbuser,
    password: dbpassword,
    port: dbport
})


app.listen(port, () => console.log(`Listening on port ${port}`))

// create a GET route
app.get('/express_backend', (req, res) => {
    client.connect()
    client.query(SQL`Select * FROM users`, (err, dbResponse)=>{
        if(err) throw err
        client.end()
        res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT', dbResponse: dbResponse.rows })
    })
    
})

app.use(express.static(path.join(__dirname, 'react-app', 'build')))