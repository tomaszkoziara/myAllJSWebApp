import VersionService from "./VersionService";
import ModalService from "../common/modal-service/ModalService"

import newVersionModalTemplate from "./NewVersionModal.html";

class VersionController {
    static $inject = ["$state", "$scope", "$uibModal", "VersionService", "ModalService", "growl"];

    constructor($state, $scope, $uibModal, VersionService, ModalService, growl) {
        this.name = "VersionController";
        this.$state = $state;
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.versionService = VersionService;
        this.modalService = ModalService;
        this.growl = growl;
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

        this.versionService.getVersion(this.lotId, this.currentVersionId).then((data) => {

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

        this.versionService.updateMeasures(this.lotId, this.version.id, changedMeasures).then(() => {
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

            this.versionService.getVersions(this.lotId).then((data) => {

                this.versions = data;

                this.currentVersionIndex = this.versions.length - 1;
                this.currentVersionNumber = this.versions[this.currentVersionIndex].number;
                this.currentVersionId = this.versions[this.currentVersionIndex].id;

            }).then(() => {

                this.loadVersion();

            });

        }).catch(function (error) {
            console.log(error);
            console.log("Cancel new version creation.");
        });

    }

    measuresDisabled() {

        return this.versions && this.versions.length > 1;

    }

};

export default VersionController;