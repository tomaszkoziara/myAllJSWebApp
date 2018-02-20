import dictionary from "./dictionary";
import DBUtils from "./DBUtils";
import Outcome from "./Outcome";
import SqlString from "sqlstring";

export default class UserService {

    static SELECT_LOTS = `SELECT
        A.id, A.code, A.type, A.class, A.status AS statusId, B.name AS status, B.code AS statusCode, A.aging,
        A.processing, A.customer, A.length, A.thickness, A.volume, A.i_date, A.total, A.pieces
        FROM lots AS A
        LEFT JOIN lot_statuses AS B
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
        var insertedLotData = await this.dbConnector.executeQuery(sql);
        var insertedVersionData = await this._createNewVersion(insertedLotData.insertId);
        var insertedMeasures = this._createEmptyMeasures(insertedLotData.insertId, insertedVersionData, 100);

        return new Outcome(insertedLotData.insertId, dictionary("lot_inserted"));
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

    async createNewVersion(lotId, modifier) {
        const newVersionId = await this._createNewVersion(lotId, modifier);
        return new Outcome(newVersionId, dictionary("version_inserted"));
    }

    async getMaxLotVersion(lotId) {
        var lastVersion = {};
        var sql = SqlString.format(`SELECT MAX(lv.number) AS maxLotVersionNumber, lv.id AS maxLotVersionId
            FROM lots AS l
            JOIN lot_versions AS lv
            ON l.id = lv.id_lot
            WHERE l.id = ?`, lotId);
        var data = await this.dbConnector.executeQuery(sql);

        lastVersion.number = data[0].maxLotVersionNumber;
        lastVersion.id = data[0].maxLotVersionId;

        return lastVersion;
    }

    async getLastLotVersion(lotId) {

        var lastVersion = await this.getMaxLotVersion(lotId);

        var sql = SqlString.format(`SELECT lvm.id AS id, lvm.length AS length, lvm.thickness AS thickness, lvm.width AS width, lvm.d_date AS d_date
            FROM lots AS l
            JOIN lot_versions AS lv
            JOIN lot_version_measures AS lvm
            ON l.id = lv.id_lot AND
            lv.id = lvm.id_lot_version
            WHERE l.id = ? and
            lv.number = ?
            ORDER BY lvm.id asc`, [lotId, lastVersion.number]);

        var data = await this.dbConnector.executeQuery(sql);

        lastVersion.measures = data;
        return new Outcome(lastVersion, "");

    }

    async updateVersionMeasures(lotId, versionId, measuresArray) {
        var queriesArray = [];
        for (var i = 0; i < measuresArray.length; i++) {
            const sql = SqlString.format(`UPDATE lot_version_measures
            SET length = ?, width = ?, thickness = ?, d_date = ?
            WHERE id = ?`, [
                    measuresArray[i].length,
                    measuresArray[i].width,
                    measuresArray[i].thickness,
                    measuresArray[i].delete ? SqlString.raw('NOW()') : null,
                    measuresArray[i].id
                ]);
            var data = await this.dbConnector.executeQuery(sql);
        }
        return new Outcome(true, "");
    }

    async getLotVersion(lotId, versionId) {
        var version = {};
        var sql = SqlString.format(`SELECT lv.number AS lotVersionNumber
            FROM lot_versions AS lv
            WHERE lv.id_lot = ? AND lv.id = ?`, [lotId, versionId]);
        var data = await this.dbConnector.executeQuery(sql);

        version.id = versionId;

        sql = SqlString.format(`SELECT lvm.id AS id, lvm.length AS length, lvm.thickness AS thickness, lvm.width AS width, lvm.d_date AS d_date
        FROM lot_versions AS lv
        JOIN lot_version_measures AS lvm
        ON lv.id = lvm.id_lot_version
        WHERE lv.id_lot = ? and
        lv.id = ?
        ORDER BY lvm.id asc`, [lotId, versionId]);

        data = await this.dbConnector.executeQuery(sql);

        version.measures = data;
        return new Outcome(version, "");
    }

    async getLotVersions(lotId) {

        const sql = SqlString.format(`SELECT id, number
            FROM lot_versions
            WHERE id_lot = ?
            ORDER BY number asc`, lotId);
        const data = await this.dbConnector.executeQuery(sql);

        return new Outcome(data, "");

    }

    async duplicateVersion(lotId, modifiers) {

        const sql = SqlString.format(`call create_new_version(?, ?, ?, ?);`, [
            lotId,
            this.percentageToUnit(modifiers.thickness),
            this.percentageToUnit(modifiers.length),
            this.percentageToUnit(modifiers.width)
        ]);

        var data = await this.dbConnector.executeQuery(sql);
        return new Outcome(true, "");
    }

    percentageToUnit(value) {

        if (value === null || value === undefined || typeof value !== "number" || value === 0) {
            return 1;
        } else if (value > -100) {
            return value / 100 + 1;
        } else {
            return 1;
        }

    }

    async _createNewVersion(lotId, modifier) {
        var sql = SqlString.format("SELECT MAX(number) AS maxVersionNumber FROM lot_versions WHERE id_lot = ?", lotId);
        var data = await this.dbConnector.executeQuery(sql);
        if (data[0].maxVersionNumber === null) {
            sql = SqlString.format("INSERT INTO lot_versions SET ?", { id_lot: lotId, number: 1 });
            data = await this.dbConnector.executeQuery(sql);
        } else {
            sql = SqlString.format("INSERT INTO lot_versions SET ?", { id_lot: lotId, number: data[0].maxVersionNumber + 1 });
            data = await this.dbConnector.executeQuery(sql);
        }
        sql = SqlString.format("SELECT MAX(number) as maxLotVersionNumber, id as maxLotVersionId FROM lot_versions WHERE id_lot = ?", lotId);
        data = await this.dbConnector.executeQuery(sql);
        return data[0].maxLotVersionId;
    }

    async _createEmptyMeasures(lotId, versionId, number) {
        var paramsArray = [];
        for (var i = 0; i < number; i++) {
            await this.dbConnector.executeQuery("INSERT INTO lot_version_measures SET id_lot_version = ?", versionId);
        }
        return true;
    }

    _createLotForInsert(lot) {
        lot.i_date = SqlString.raw("NOW()");
        return lot;
    }

    _createLotForUpdate(lot) {
        lot.u_date = SqlString.raw('NOW()');
        return lot;
    }

}