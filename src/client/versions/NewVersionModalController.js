class NewVersionModalController {

    static $inject = ["$state", "$scope", "VersionService"];

    constructor($state, $scope, VersionService) {
        this.name = "NewVersionModalController";
        this.$state = $state;
        this.$scope = $scope;
        this.versionService = VersionService;
    }

    $onInit() {
    }

    createNewVersion(result) {
        var modifiers = {
            thickness: this.thicknessPercentage,
            width: this.widthPercentage,
            length: this.lengthPercentage
        };
        this.$close(modifiers);
    }

    cancel(result) {
        this.$dismiss("cancel");
    }

}

export default NewVersionModalController;