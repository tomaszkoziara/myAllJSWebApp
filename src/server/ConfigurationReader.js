import properties from "properties";

export default function readConfiguration(configurationFilePath) {

    return new Promise(function (resolve, reject) {

        properties.parse(configurationFilePath, {
            path: true,
            namespaces: true
        }, function (error, object) {
            if (error) {
                reject("Cannot read properties file: " + configurationFilePath + "\n" + error);
            } else {
                resolve(object);
            }
        });

    });

}