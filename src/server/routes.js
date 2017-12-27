import Router from "koa-router";
import UserService from "./UserService";

export default function createRoutes(dbConnector) {
    var router = new Router();
    var userService = new UserService(dbConnector);

    router
        .get("/api/users", async function (context, next) {
            var users = await userService.getUsers();
            context.body = users;
        })
        .get("/api/users/:id", async function (context, next) {
            var users = await userService.getUser(context.params.id);
            context.body = users;
        })
        .post("/api/users", async function (context, next) {
            var params = context.request.body;

            var outcome = await userService.insertUser(params);
            console.log(outcome);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .delete("/api/users/:id", async function (context, next) {
            var outcome = await userService.deleteUser(context.params.id);
            console.log(outcome);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        });

    return router.routes();
}

