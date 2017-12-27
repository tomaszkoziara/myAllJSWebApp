import UsersController from "./UsersController";

export default {
    template: require("./users.html"),
    controller: UsersController,
    bindings: {
        users: "="
    }
}