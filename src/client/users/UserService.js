import angular from "angular";

class UserService {
    static $inject = ["APIService"]

    constructor(APIService) {
        this.APIService = APIService;
    }

    getUsers() {
        // var self = this;
        return this.APIService.get("/api/users");
    }
}


export default UserService;