import UserService from "./UserService";

class UsersController {
    static $inject = ["$scope", "UserService"];

    constructor($scope, UserService) {
        this.name = "UsersController";
        this.userService = UserService;
    }

    $onInit() {
        var self = this;
        this.userService.getUsers().then((data) => {
            self.users = data;
        });

    }

}

export default UsersController;