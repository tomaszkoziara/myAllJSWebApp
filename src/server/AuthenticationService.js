import dictionary from "./dictionary";
import Outcome from "./Outcome";
var bcrypt = require("bcryptjs");

export default class AuthenticationService {

    constructor(dbConnector) {
        this.dbConnector = dbConnector;
    }

    async updateUserPassword(id, oldPassword, newPassword) {
        if (this.comparePassword(id, oldPassword)) {
            const newPasswordHash = await this.encryptPassword(encryptPassword);
            sql = SqlString.format("UPDATE users SET password = ? WHERE id = ?", [newPasswordHash, id]);
            const result = await dbConnector.executeQuery(sql);

            return new Outcome(true, dictionary("password_updated"));
        }
        return new Outcome(false, dictionary("old_password_mismatch"));
    }

    async comparePassword(id, password) {
        var sql = SqlString.format("SELECT password FROM users WHERE id = ?", id);
        const oldPasswordHash = await dbConnector.executeQuery(sql);

        return bcrypt.compare(password, oldPasswordHash);
    }

    async encryptPassword(password) {
        return bcrypt.hash(password, 14);
    }

}