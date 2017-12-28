import dictionary from "./dictionary";
import DBUtils from "./DBUtils";
import Outcome from "./Outcome";
import SqlString from "sqlstring";

export default class UserService {

    static SELECT_LOTS = `SELECT
        A.id, A.code, A.type, A.class, B.name AS status, B.code AS statusCode, A.aging,
        A.processing, A.customer, A.length, A.thickness, A.volume, A.i_date, A.total, A.pieces
        FROM carpenter.lots AS A
        LEFT JOIN carpenter.lot_status AS B
        ON A.status = B.id`;

    constructor(dbConnector) {
        this.dbConnector = dbConnector;
    }

    async getLots() {
        var data = await this.dbConnector.executeQuery(UserService.SELECT_LOTS + " ORDER BY i_date desc");
        return new Outcome(data, "");
    }

    async getLot(id) {
        const sql = SqlString.format(UserService.SELECT_LOTS + " WHERE ID = ?", id);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data, "");
    }

    async insertLot(user) {
        // var insertUser = await this._createUserForInsert(user);
        // if (!DBUtils.minimumPropertiesSet(insertUser, ["name", "surname", "username", "password"])) {
        //     return Outcome(false, dictionary("user_min_properties_not_set"));
        // }

        // const sql = SqlString.format("INSERT INTO users SET ?", insertUser);
        // var data = await this.dbConnector.executeQuery(sql);
        // return new Outcome(data.insertId, dictionary("user_inserted"));
    }

    async deleteLot(id) {
        // const sql = SqlString.format("DELETE FROM users WHERE ID = ?", id);
        // var data = await this.dbConnector.executeQuery(sql);
        // console.log(data);
        // return new Outcome(data.affectedRows === 1, "");
    }

    async editLot(id, user) {
        // const sql = SqlString.format("UPDATE users SET ? WHERE id = ?", [await this._createUserForUpdate(user), id]);
        // var data = await this.dbConnector.executeQuery(sql);
        // return new Outcome(data.changedRows, "");
    }

    // async updatePassword(id, oldPassword, newPassword) {
    //     this.authenticationService.updatePassword(id, oldPassword, newPassword);
    // }

    // async _createUserForInsert(user) {
    //     return {
    //         name: user.name,
    //         surname: user.surname,
    //         username: user.username,
    //         password: await this.authenticationService.encryptPassword(user.password),
    //         i_date: SqlString.raw('NOW()')
    //     }
    // }

    // async _createUserForUpdate(user) {
    //     return {
    //         name: user.name,
    //         surname: user.surname,
    //         u_date: SqlString.raw('NOW()')
    //     }
    // }

}