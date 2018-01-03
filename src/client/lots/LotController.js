import LotService from "./LotService";

class LotController {
    static $inject = ["$state", "LotService", "$scope", "growl"];

    constructor($state, LotService, $scope, growl) {
        this.name = "LotController";
        this.$state = $state;
        this.lotService = LotService;
        this.$scope = $scope;
        this.growl = growl;
    }

    title() {
        var title = "";
        if (this.id) {
            title = "Dettaglio distinta";
            if (this.lot && this.lot.code) {
                title += ": " + this.lot.code;
            }
        } else {
            title = "Nuova distinta";
        }
        return title;
    }

    isFormDirty() {
        return this.$scope.lotForm.$dirty;
    }

    saveLot() {
        if (this.id) {
            this.lotService.updateLot(this.lot);
            this.growl.info("Distinta aggiornata.");
            this.$state.go("lots");
        } else {
            this.lotService.insertLot(this.lot);
            this.growl.info("Distinta inserita.");
            this.$state.go("lots");
        }
    }

    $onInit() {
        var self = this;
        this.id = parseInt(this.$state.params.id);
        if (this.id) {
            this.lotService.getLot(this.id).then((data) => {
                self.lot = data[0];
            });
        }
        this.lotService.getLotStatuses().then((data) => {
            self.lotStatuses = data;
        });
    }

}

export default LotController;