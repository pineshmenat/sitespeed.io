'use strict';

const mysql = require('mysql2');

class MySQLDBSender {
  constructor({ host, database, user, password }) {
    this.client = mysql.createConnection({
      host: host,
      user: user,
      password: password.toString(),
      database: database
    });
  }
   
  

  execute(query, data, callback) {
    this.client.config.namedPlaceholders = true;
    this.client.execute(query, data, callback);
  }
}

module.exports = MySQLDBSender;
