class NotificationService {

    static $inject = ["growl"];

    constructor(growl) {
        this.growl = growl;
    }

    warning(message) {

        this.growl.warning(message);

    }

    info(message) {

        this.growl.info(message);

    }

    success(message) {

        this.growl.success(message);

    }

    error(message) {

        this.growl.error(message);

    }

}

export default NotificationService;