const Pool = require("pg").Pool
console.log("process.env.DBPASSWORD", process.env.DBPASSWORD)
const pool = new Pool({
  user: process.env.DBUSER || 'postgres',
  password: process.env.DBPASSWORD || '', // TODO: obviously pass these creds along from some Chef-like infra helper
  host: process.env.DBHOST || '35.212.167.150',
  port: process.env.DBPORT || 5432,
  database: 'nodes',
})

module.exports = pool
