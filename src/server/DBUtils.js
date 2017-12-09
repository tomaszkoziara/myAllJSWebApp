export default class DBUtils {

    static minimumPropertiesSet(object, properties) {
        for (var i = 0; i < properties.length; i++) {
            if (!this.hasValue(object[properties[i]])) {
                return false;
            }
        }
        return true;
    }

    static hasValue(object) {
        if (object === undefined || object === null) {
            return false;
        }
        if (object instanceof String) {
            return object.trim() !== "";
        } else {
            return true;
        }
    }

}