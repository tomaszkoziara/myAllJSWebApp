class APIService {

    static $inject = ["$http", "$q", "NotificationService"];

    constructor($http, $q, NotificationService) {

        this.$http = $http;
        this.$q = $q;
        this.NotificationService = NotificationService;

    }

    callHTTPMethod(verb, url, params) {

        return this.$q((resolve, reject) => {
            resolve(this.$http[verb](url, params));
        }).then((response) => {
            if (response.status === 200) {
                return response.data.result;
            } else {
                this.NotificationService.error(response.data.message);
            }
        }).catch(() => {
            this.NotificationService.error("Si è verificato un errore.");
        });

    }

    get(url) {
        return this.callHTTPMethod("get", url);
    }

    post(url, params) {
        return this.callHTTPMethod("post", url, params);
    }

    put(url, params) {
        return this.callHTTPMethod("put", url, params);
    }

    delete(url) {
        return this.callHTTPMethod("delete", url);
    }

}


export default APIService;