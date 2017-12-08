import Koa from "koa";
import Router from "koa-router";
import { DBConnector } from "./DBConnector";

export function runServer(port = 3000) {

    var app = new Koa();
    var router = new Router();
    var dbConnector = new DBConnector("localhost", "root", "password", "carpenter");

    router
        .get("/", async function (context, next) {
            context.body = "Hello world!";
        })
        .get("/users", async function (context, next) {
            var users = await dbConnector.getUsers()
            context.body = users;
        });

    app.use(router.routes());
    app.listen(port);

    console.log("Listening at localhost:" + port);

}