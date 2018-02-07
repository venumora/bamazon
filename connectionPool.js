var mysql      = require('mysql');
var connectionPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user     : 'root',
    password : '********',
    database : 'bamazon'
});

module.exports = {
    connectionPool
};