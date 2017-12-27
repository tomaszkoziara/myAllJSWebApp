import UserService from "./UserService";

class UsersController {
    static $inject = ["$scope", "UserService"];

    constructor($scope, UserService) {
        debugger
        this.name = "UsersController";
        this.userService = UserService;
        this.prova = "Ciao!";
    }

    $onInit() {
        var self = this;
        this.userService.getUsers().then((data) => {
            debugger
            self.users = data;
        });

        // this.users = [];
        // this.users.push({
        //     id: 1,
        //     name: "asd",
        //     surname: "adaad",
        //     username: "dddd",
        //     i_date: new Date(),
        //     u_date: new Date()
        // });
    }

    // $onDestroy() {
    //     console.log("$onDestroy")
    // }
}

export default UsersController;