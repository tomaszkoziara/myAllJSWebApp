import Koa from "koa";
import routes from "./routes"
import { DBConnector } from "./DBConnector";

var bodyParser = require('koa-bodyparser');

export function runServer(port = 3000) {

    var app = new Koa();

    var dbConnector = new DBConnector("localhost", "root", "password", "carpenter");

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
    app.use(bodyParser());
    app.use(routes(dbConnector));
    // app.use(async function (context, next) {
    //     try {
    //         return await next();
    //     } catch (error) {
    //         const response = {};
    //         context.status = parseInt(error.status, 10) || context.status || 500;

    //         switch (context.status) {
    //             case 400:
    //             case 401:
    //             case 403:
    //             case 404:
    //             case 500: {
    //                 response.error = { message: error.message };
    //                 break;
    //             }
    //             default: {
    //                 response.error = { message: 'Unknown error' };
    //             }
    //         }

    //         context.body = response;
    //         console.log(error);
    //     }
    // });


    app.listen(port);

    console.log("Listening at localhost:" + port);

}
