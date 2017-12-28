import angular from "angular";

class LotService {
    static $inject = ["APIService"]

    constructor(APIService) {
        this.APIService = APIService;
    }

    getLots() {
        return this.APIService.get("/api/lots");
    }
}


export default LotService;