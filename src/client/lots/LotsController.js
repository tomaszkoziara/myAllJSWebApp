import LotService from "./LotService";

class LotsController {
    static $inject = ["$state", "LotService"];

    constructor($state, LotService) {
        this.name = "LotsController";
        this.$state = $state;
        this.lotService = LotService;
    }

    $onInit() {
        var self = this;
        this.lotService.getLots().then((data) => {
            self.lots = data;
        });

    }

    goToLotDetail(id) {
        this.$state.go("lot", { id: id });
    }

    goToCreateLotDetail() {
        this.$state.go("lot", { id: null });
    }

    deleteLot(id) {
        this.lotService.deleteLot(id);
    }

}

export default LotsController;