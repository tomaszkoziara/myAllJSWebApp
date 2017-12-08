import Koa from "koa";
import Router from "koa-router";
import { DBConnector } from "./DBConnector";

var bodyParser = require('koa-bodyparser');

export function runServer(port = 3000) {

    var app = new Koa();
    var router = new Router();
    var dbConnector = new DBConnector("localhost", "root", "password", "carpenter");

    router
        .get("/", async function (context, next) {
            context.body = "Hello world!";
        })
        .get("/users", async function (context, next) {
            var users = await dbConnector.getUsers();
            context.body = users;
        })
        .get("/users/:id", async function (context, next) {
            var users = await dbConnector.getUser(context.params.id);
            context.body = users;
        })
        .post("/users", async function (context, next) {
            var params = context.request.body;

            context.throw(400, "Fuck!");
            // if (!params.name ||
            //     !params.surname ||
            //     !params.username ||
            //     !params.password) {

            //     // context.status = 400;
            //     // context.body = {
            //     //     message: "All user parameters must be set!"
            //     // };
            //     // return;
            //     context.throw("400", "All user parameters must be set!");
            // }

            // var user = {
            //     name: params.name,
            //     surname: params.surname,
            //     username: params.username,
            //     password: params.password
            // };
            // var inserted = await dbConnector.insertUser(user);
            // context.body = inserted;
            // return await next();
        });

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
        }
    });
    app.use(bodyParser());
    app.use(router.routes());
    app.use(async function (ctx, next) {
        try {
            // Go down the stream
            return await next();
        } catch (err) {
            // If an error occurs down the stream and no response is sent by
            // another middleware before, the error gets caught up here
            const response = {};
            // Set status on ctx
            ctx.status = parseInt(error.status, 10) || ctx.status || 500;
            // Build response or do whatever you want depending on status 
            switch (ctx.status) {
                case 400:
                case 401:
                case 403:
                case 404:
                case 500: {
                    response.error = { message: err.message };
                    break;
                }
                default: {
                    response.error = { message: 'Unknown error' };
                }
            }
            // End processing by sending response
            ctx.body = response;
        }
    });


    app.listen(port);

    console.log("Listening at localhost:" + port);

}
