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

    async getUsers() {
        var data = await this.executeQuery('SELECT * FROM USERS');
        return data;
    }

    async getUser(id) {
        var data = await this.executeQuery('SELECT * FROM USERS WHERE ID = ' + id);
        return data;
    }

    async insertUser(user) {
        const queryString = mysql.format("INSERT INTO USERS SET ?", user);
        var data = await this.executeQuery(queryString);
        return data.id;
    }

}
