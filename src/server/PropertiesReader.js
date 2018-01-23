import path from "path";
import properties from "properties";

export default function readProperties() {

    return new Promise(function (resolve, reject) {
        properties.parse(path.resolve(__dirname, "server.properties"), {
            path: true,
            namespaces: true
        }, function (error, object) {
            if (error) {
                reject("Cannot read server.properties\n" + error);
            } else {
                resolve(object);
            }
        });
    });

}