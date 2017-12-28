import LotService from "./LotService";

class LotsController {
    static $inject = ["$scope", "LotService"];

    constructor($scope, LotService) {
        this.name = "LotsController";
        this.lotService = LotService;
    }

    $onInit() {
        var self = this;
        this.lotService.getLots().then((data) => {
            self.lots = data;
        });

    }

}

export default LotsController;