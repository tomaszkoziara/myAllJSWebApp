var mysql = require("mysql");

export class DBConnector {

    constructor(host, port, user, password, database) {
        this.dbConfig = {
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        };
        this.connectionPool = mysql.createPool(this.dbConfig);
    }

    async executeQuery(query, parameters) {
        return new Promise(function (connectionPool) {
            return function (resolve, reject) {
                connectionPool.getConnection(function (error, connection) {
                    if (error) {
                        throw error;
                    }
                    connection.query(query, parameters, function (error, results, fields) {
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

    async getConnection() {
        return connectionPool.getConnection();
    }

}
