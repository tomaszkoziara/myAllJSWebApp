import Router from "koa-router";
import KoaCompose from "koa-compose";
import UserService from "./UserService";
import LotService from "./LotService";

export default function createRoutes(dbConnector) {
    var userService = new UserService(dbConnector);
    var lotService = new LotService(dbConnector);

    const usersRouter = new Router();
    usersRouter.prefix("/api/users")
        .get("/", async function (context, next) {
            var users = await userService.getUsers();
            context.body = users;
        })
        .get("/:id", async function (context, next) {
            var users = await userService.getUser(context.params.id);
            context.body = users;
        })
        .post("/", async function (context, next) {
            var params = context.request.body;

            var outcome = await userService.insertUser(params);
            console.log(outcome);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .delete("/:id", async function (context, next) {
            var outcome = await userService.deleteUser(context.params.id);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        });

    const lotsRouter = new Router();
    lotsRouter.prefix("/api/lots")
        .get("/statuses", async function (context, next) {
            var statuses = await lotService.getLotStatuses();
            context.body = statuses;
        })
        .get("/", async function (context, next) {
            var lots = await lotService.getLots();
            context.body = lots;
        })
        .post("/", async function (context, next) {
            var params = context.request.body;

            var outcome = await lotService.insertLot(params);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .get("/:id", async function (context, next) {
            var lot = await lotService.getLot(context.params.id);
            context.body = lot;
        })
        .put("/:id", async function (context, next) {
            var params = context.request.body;

            var outcome = await lotService.updateLot(context.params.id, params);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .delete("/:id", async function (context, next) {
            var outcome = await lotService.deleteLot(context.params.id);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .get("/:id/versions/last", async function (context, next) {
            var outcome = await lotService.getLastLotVersion(context.params.id);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome;
            }
        })
        .get("/:lotId/versions", async function (context, next) {
            var outcome = await lotService.getLotVersions(context.params.lotId);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome;
            }
        })
        .get("/:lotId/versions/:versionId", async function (context, next) {
            var outcome = await lotService.getLotVersion(context.params.lotId, context.params.versionId);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome;
            }
        })
        .post("/:id/versions/:versionId/measures", async function (context, next) {
            // create a bunch of new measure for a version (later)
            context.body = { "result": "create a bunch of new measure for a version (later)" };
        })
        .put("/:lotId/versions/:versionId/measures", async function (context, next) {
            var outcome = await lotService.updateVersionMeasures(context.params.lotId, context.params.versionId, context.request.body);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome.result;
            }
        })
        .post("/:lotId/versions", async function (context, next) {
            var params = context.request.body;
            params.thickness = parseInt(params.thickness);
            params.length = parseInt(params.length);
            params.width = parseInt(params.width);

            var outcome = await lotService.duplicateVersion(context.params.lotId, params);
            if (!outcome.result) {
                context.throw(400, outcome.message);
            } else {
                context.body = outcome;
            }
        });

    const composedRoutes = KoaCompose([usersRouter.routes(), lotsRouter.routes()]);

    return composedRoutes;
}

