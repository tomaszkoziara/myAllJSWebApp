import dictionary from "./dictionary";
import DBUtils from "./DBUtils";
import Outcome from "./Outcome";
import SqlString from "sqlstring";

export default class UserService {

    static SELECT_LOTS = `SELECT
        A.id, A.code, A.type, A.class, B.name AS status, B.code AS statusCode, A.aging,
        A.processing, A.customer, A.length, A.thickness, A.volume, A.i_date, A.total, A.pieces
        FROM carpenter.lots AS A
        LEFT JOIN carpenter.lot_statuses AS B
        ON A.status = B.id`;

    constructor(dbConnector) {
        this.dbConnector = dbConnector;
    }

    async getLots() {
        var data = await this.dbConnector.executeQuery(UserService.SELECT_LOTS + " ORDER BY i_date desc");
        return new Outcome(data, "");
    }

    async getLot(id) {
        const sql = SqlString.format(UserService.SELECT_LOTS + " WHERE A.id = ?", id);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data, "");
    }

    async insertLot(lot) {
        var insertLot = this._createLotForInsert(lot);

        const sql = SqlString.format("INSERT INTO lots SET ?", insertLot);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data.insertId, dictionary("lot_inserted"));
    }

    async deleteLot(id) {
        const sql = SqlString.format("DELETE FROM lots WHERE ID = ?", id);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data.affectedRows === 1, "");
    }

    async updateLot(id, lot) {
        var updateLot = this._createLotForUpdate(lot);

        const sql = SqlString.format("UPDATE lots SET ? WHERE id = ?", [updateLot, id]);
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data.changedRows, "");
    }

    async getLotStatuses() {
        const sql = SqlString.format("SELECT * FROM lot_statuses");
        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(data, "");
    }

    _createLotForInsert(lot) {
        return {
            code: lot.code,
            type: lot.type,
            class: lot.class,
            status: lot.status,
            aging: lot.aging,
            processing: lot.processing,
            customer: lot.customer,
            length: lot.length,
            thickness: lot.thickness,
            volume: lot.volume,
            i_date: SqlString.raw("NOW()")
        }
    }

    _createLotForUpdate(lot) {
        var lotForUpdate = this._createLotForInsert(lot);
        lotForUpdate.u_date = SqlString.raw('NOW()');
        return lotForUpdate;
    }

}