import angular from "angular";

class LotService {
    static $inject = ["APIService"]

    constructor(APIService) {
        this.APIService = APIService;
    }

    getLots() {
        return this.APIService.get("/api/lots");
    }

    getLot(id) {
        return this.APIService.get("/api/lots/" + id);
    }

    insertLot(lot) {
        return this.APIService.post("/api/lots", lot);
    }

    updateLot(lot) {
        return this.APIService.put("/api/lots/" + lot.id, lot);
    }

    deleteLot(id) {
        return this.APIService.delete("/api/lots/" + id);
    }

    getLotStatuses() {
        return this.APIService.get("/api/lots/statuses");
    }
}


export default LotService;