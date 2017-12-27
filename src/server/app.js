import Koa from "koa";
import serve from "koa-static";
import routes from "./routes"
import path from "path";
import { DBConnector } from "./DBConnector";

var bodyParser = require('koa-bodyparser');

export function runServer(port = 3000) {

    var app = new Koa();

    var dbConnector = new DBConnector("localhost", "root", "password", "carpenter");

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

    app.listen(port);

    console.log("Listening at localhost:" + port);

}
