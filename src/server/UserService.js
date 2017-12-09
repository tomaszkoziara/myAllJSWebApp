import dictionary from "./dictionary";
import DBUtils from "./DBUtils";
import Outcome from "./Outcome";
import SqlString from "sqlstring";
import AuthenticationService from "./AuthenticationService";

export default class UserService {

    constructor(dbConnector) {
        this.dbConnector = dbConnector;
        this.authenticationService = new AuthenticationService(dbConnector);
    }

    async getUsers() {
        var data = await this.dbConnector.executeQuery("SELECT * FROM users");
        return new Outcome(data, "");
    }

    async getUser(id) {
        const sql = SqlString.format("SELECT * FROM users WHERE ID = ?", id);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data, "");
    }

    async insertUser(user) {
        var insertUser = await this._createUserForInsert(user);
        if (!DBUtils.minimumPropertiesSet(insertUser, ["name", "surname", "username", "password"])) {
            return Outcome(false, dictionary("user_min_properties_not_set"));
        }

        const sql = SqlString.format("INSERT INTO users SET ?", insertUser);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data.insertId, dictionary("user_inserted"));
    }

    async deleteUser(id) {
        const sql = SqlString.format("DELETE FROM users WHERE ID = ?", id);
        var data = await this.dbConnector.executeQuery(sql);
        console.log(data);
        return new Outcome(data.affectedRows === 1, "");
    }

    async editUser(id, user) {
        const sql = SqlString.format("UPDATE users SET ? WHERE id = ?", [await this._createUserForUpdate(user), id]);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data.changedRows, "");
    }

    async updatePassword(id, oldPassword, newPassword) {
        this.authenticationService.updatePassword(id, oldPassword, newPassword);
    }

    async _createUserForInsert(user) {
        return {
            name: user.name,
            surname: user.surname,
            username: user.username,
            password: await this.authenticationService.encryptPassword(user.password),
            i_date: SqlString.raw('NOW()')
        }
    }

    async _createUserForUpdate(user) {
        return {
            name: user.name,
            surname: user.surname,
            u_date: SqlString.raw('NOW()')
        }
    }

}