import UserService from "./UserService";

class UserController {
    static $inject = ["$stateParams", "UserService"];

    constructor($stateParams, UserService) {
        debugger
        this.name = "UserController";
        this.userService = UserService;
    }

    $onInit() {
        // var self = this;
        // this.userService.getUsers().then((data) => {
        //     self.users = data;
        // });

    }

}

export default UsersController;