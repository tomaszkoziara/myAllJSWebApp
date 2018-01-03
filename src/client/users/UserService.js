import angular from "angular";

class UserService {
    static $inject = ["APIService"]

    constructor(APIService) {
        this.APIService = APIService;
    }

    getUsers() {
        return this.APIService.get("/api/users");
    }
}


export default UserService;