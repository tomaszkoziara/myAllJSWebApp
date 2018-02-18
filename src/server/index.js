import path from "path";
import { runServer } from "./app";

runServer(getConfigurationFilePath());

function getConfigurationFilePath() {

    var confFilePath = null;

    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf("--conf=") === 0) {
            confFilePath = process.argv[i].replace(/--conf=/g, "");
        }
    }
    if (!confFilePath) {
        confFilePath = path.resolve(process.cwd(), "server.properties");
    }

    return confFilePath;
};