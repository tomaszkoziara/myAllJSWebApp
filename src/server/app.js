import Koa from "koa";
import serve from "koa-static";
import routes from "./routes"
import path from "path";
import { DBConnector } from "./DBConnector";
import readProperties from "./PropertiesReader";

var bodyParser = require('koa-bodyparser');

export async function runServer() {

    process.on('unhandledRejection', e => {
        throw e;
    });

    const conf = await readProperties();
    console.log("Configuration:\n");
    console.log(conf);
    console.log("\n");

    var app = new Koa();

    var dbConnector = new DBConnector(conf.database.host, conf.database.user, conf.database.password, conf.database.schema);

    const publicFolder = path.resolve(__dirname, "www");
    console.log("Public folder is " + publicFolder);

    app.use(serve(publicFolder));
    app.use(bodyParser());
    app.use(routes(dbConnector));

    app.use(async function (context, next) {
        try {
            await next();
        } catch (error) {
            var status = error.status || 500;
            context.status = status;
            context.body = {
                status: status,
                cause: error.name,
                message: error.message
            };

            if (status === 500) {
                console.log(error);
            }
        }
    });

    app.use(async function (context, next) {
        console.log("Requested [" + context.method + "] " + context.url);
        await next();
    });
    app.listen(conf.server.port);

    console.log("Listening at localhost:" + conf.server.port);

}
