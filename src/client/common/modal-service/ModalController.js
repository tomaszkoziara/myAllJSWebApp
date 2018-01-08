class ModalController {

    static $inject = ["$uibModal", "params"];

    constructor($uibModal, params) {
        this.$uibModal = $uibModal;

        this.headerText = params.headerText;
        this.bodyText = params.bodyText;
        this.cancelButtonText = params.cancelButtonText;
        this.actionButtonText = params.actionButtonText;
    }

    action(result) {
        this.$close(true);
    }

    cancel(result) {
        this.$dismiss("cancel");
    }

}

export default ModalController;