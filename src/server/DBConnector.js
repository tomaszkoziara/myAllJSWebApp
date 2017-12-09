var mysql = require("mysql");

export class DBConnector {

    constructor(host, user, password, database) {
        this.dbConfig = {
            host: host,
            user: user,
            password: password,
            database: database
        };
        this.connectionPool = mysql.createPool(this.dbConfig);
    }

    async executeQuery(query) {
        return new Promise(function (connectionPool) {
            return function (resolve, reject) {
                connectionPool.getConnection(function (error, connection) {
                    connection.query(query, function (error, results, fields) {
                        connection.release();
                        if (error) {
                            reject(error);
                        };
                        resolve(results);
                    });
                });

            }
        }(this.connectionPool));
    }

}
