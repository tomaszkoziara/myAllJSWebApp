class APIService {

    static $inject = ['$http', '$q'];

    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    get(url) {
        return this.$q((resolve, reject) => {
            this.$http.get(url).then((response) => {
                if (response.status === 200) {
                    resolve(response.data.result);
                }
            });
        });
    }

    post(url, params) {
        return this.$q((resolve, reject) => {
            this.$http.post(url, params).then((response) => {
                if (response.status === 200) {
                    resolve(true);
                }
            });
        });
    }

    put(url, params) {
        return this.$q((resolve, reject) => {
            this.$http.put(url, params).then((response) => {
                if (response.status === 200) {
                    resolve(true);
                }
            });
        });
    }

    delete(url) {
        return this.$q((resolve, reject) => {
            this.$http.delete(url).then((response) => {
                if (response.status === 200) {
                    resolve(response.data.result);
                }
            });
        });
    }

}


export default APIService;