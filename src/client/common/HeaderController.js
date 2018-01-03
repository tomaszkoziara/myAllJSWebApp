class HeaderController {

    static $inject = ["$state"];

    constructor($state) {
        this.$state = $state;
    }

    isActive(stateName) {
        return this.$state.current.name === stateName;
    }

}

export default HeaderController;