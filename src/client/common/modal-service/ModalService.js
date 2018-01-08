import template from "./confirmModalTemplate.html";

class ModalService {

    static $inject = ["$uibModal"];

    constructor($uibModal) {
        this.$uibModal = $uibModal;
    }

    showConfirmModal(params) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            template: template,
            controller: "ModalController",
            controllerAs: "confirmModalController",
            resolve: {
                params: function () {
                    return params;
                }
            },
            bindToController: true
        };

        return this.$uibModal.open(modalDefaults).result;
    }

}


export default ModalService;