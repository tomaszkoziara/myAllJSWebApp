import LotService from "./LotService";
import ModalService from "../common/modal-service/ModalService"

class LotsController {
    static $inject = ["$state", "LotService", "ModalService"];

    constructor($state, LotService, ModalService) {
        this.name = "LotsController";
        this.$state = $state;
        this.lotService = LotService;
        this.modalService = ModalService;
    }

    $onInit() {
        this.loadLots();
    }

    loadLots() {
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

    goToVersionDetail(id) {
        this.$state.go("version", { id: id });
    }

    downloadLotExport(lotId) {
        this.lotService.getLotPdf(lotId);
    }

    deleteLot(id) {
        var self = this;
        this.modalService.showConfirmModal({
            headerText: "Rimozione distinta",
            bodyText: "Rimuovere in modo definitivo la distinta?",
            cancelButtonText: "Annulla",
            actionButtonText: "OK"
        }).then(function () {

            return self.lotService.deleteLot(id);

        }).then(function () {

            return self.loadLots();

        });
    }

    callLongProcedure() {
        this.lotService.callLongProcedure();
    }

}

export default LotsController;