const express = require('express') 
const path = require('path')
const fs = require('fs')
const http = require('http')
const https = require('https')
const app = express()

const privateKey = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/privkey.pem', 'utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/cert.pem', 'utf8')
const ca = fs.readFileSync('/etc/letsencrypt/live/yourdomain.com/chain.pem', 'utf8')

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
}

const port = process.env.PORT || 8000

app.use("/nodes", require("./routes/nodes") )
app.use("/edges", require("./routes/edges") )

app.use(express.static(path.join(__dirname, 'react-app', 'build')))

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => console.log(`Listening on port ${port}`))

httpsServer.listen(443, ()=>{
    console.log('HTTPS Server running on port 443')
})