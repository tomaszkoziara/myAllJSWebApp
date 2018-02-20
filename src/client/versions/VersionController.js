import VersionService from "./VersionService";
import LotService from "../lots/LotService";
import ModalService from "../common/modal-service/ModalService"

import newVersionModalTemplate from "./NewVersionModal.html";

class VersionController {
    static $inject = ["$state", "$scope", "$uibModal", "VersionService", "LotService", "ModalService", "growl"];

    constructor($state, $scope, $uibModal, VersionService, LotService, ModalService, growl) {
        this.name = "VersionController";
        this.$state = $state;
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.versionService = VersionService;
        this.lotService = LotService;
        this.modalService = ModalService;
        this.growl = growl;

        this.total = 0;
    }

    $onInit() {

        this.lotId = parseInt(this.$state.params.id);

        this.versionService.getVersions(this.lotId).then((data) => {

            this.versions = data;

            this.currentVersionIndex = this.versions.length - 1;
            this.currentVersionNumber = this.versions[this.currentVersionIndex].number;
            this.currentVersionId = this.versions[this.currentVersionIndex].id;

        }).then(() => {

            this.loadVersion();

        });

    }

    versionBack() {

        if (this.currentVersionIndex > 0) {

            this.currentVersionIndex--;
            this.currentVersionNumber = this.versions[this.currentVersionIndex].number;
            this.currentVersionId = this.versions[this.currentVersionIndex].id;

            this.loadVersion();

        }

    }

    versionForth() {

        if (this.currentVersionIndex < this.versions.length - 1) {

            this.currentVersionIndex++;
            this.currentVersionNumber = this.versions[this.currentVersionIndex].number;
            this.currentVersionId = this.versions[this.currentVersionIndex].id;

            this.loadVersion();

        }

    }

    loadVersion() {

        return this.versionService.getVersion(this.lotId, this.currentVersionId).then((data) => {

            this.version = data;
            this.originalVersion = angular.copy(data);

        });

    }

    isMeasuresFormDirty() {

        return this.measuresForm.$dirty;

    }

    resetMeasuresForm() {

        this.version = angular.copy(this.originalVersion);
        this.measuresForm.$setPristine();

    }

    updateMeasures() {

        var changedMeasures = [];
        for (var i = 0; i < this.version.measures.length; i++) {
            if (this.version.measures[i].changed) {
                changedMeasures.push(this.version.measures[i]);
            }
        }

        this.versionService.updateMeasures(this.lotId, this.version.id, changedMeasures)
            .then(() => {
                var total = this.reckonTotal();
                var pieces = this.reckonPieces();

                return this.lotService.updateLot({
                    id: this.lotId,
                    total: total,
                    pieces: pieces
                });
            })
            .then(() => {
                this.growl.info("Misure aggiornate.");
                this.loadVersion();
                this.measuresForm.$setPristine();
            });

    }

    markAsChanged(index) {

        this.version.measures[index].changed = true;

    }

    openNewVersionModal() {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            template: newVersionModalTemplate,
            controller: "NewVersionModalController",
            controllerAs: "newVersionModalController",
            bindToController: true
        };

        this.$uibModal.open(modalDefaults).result.then((modifiers) => {

            return this.versionService.createNewVersion(this.lotId, modifiers);

        }).then(() => {

            return this.versionService.getVersions(this.lotId);

        }).then((data) => {

            this.versions = data;

            this.currentVersionIndex = this.versions.length - 1;
            this.currentVersionNumber = this.versions[this.currentVersionIndex].number;
            this.currentVersionId = this.versions[this.currentVersionIndex].id;

            return Promise.resolve();

        }).then(() => {

            return this.loadVersion();

        }).then(() => {
            var total = this.reckonTotal();
            var pieces = this.reckonPieces();

            return this.lotService.updateLot({
                id: this.lotId,
                total: total,
                pieces: pieces
            });
        }).catch(function (error) {
            console.log(error);
            console.log("Cancel new version creation.");
        });

    }

    cancelMeasureDisabled() {

        return this.versions && (this.currentVersionIndex !== this.versions.length - 1);

    }

    measuresDisabled() {

        return this.versions && this.versions.length > 1;

    }

    showAddMeasure() {

        return this.versions && this.versions.length === 1;

    }

    addNewMeasure() {

        this.version.measures.push({
            thickness: 0,
            length: 0,
            width: 0,
            d_date: null
        });

    }

    reckonPieces() {

        var pieces = 0;

        for (var i = 0; i < this.version.measures.length; i++) {
            var measures = this.version.measures[i];

            if (!measures.d_date && !measures.delete && measures.thickness && measures.length && measures.width) {
                pieces++;
            }

        }

        return pieces;

    }

    reckonTotal() {

        var total = 0;

        for (var i = 0; i < this.version.measures.length; i++) {
            var measures = this.version.measures[i];

            if (!measures.d_date && !measures.delete && measures.thickness && measures.length && measures.width) {

                var partial = measures.thickness * measures.length * measures.width / 100000;
                total += parseFloat(partial.toFixed(3));

            }

        }

        if (total > 0) {
            total = parseFloat((total / 100).toFixed(3))
        }

        return total;

    }

};

export default VersionController;