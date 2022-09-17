const mysql = require('mysql');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  port: 3307,
  database : "mydb"
});


module.exports = connection;