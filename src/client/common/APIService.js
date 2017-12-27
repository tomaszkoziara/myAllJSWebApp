class APIService {

    static $inject = ['$http', '$q'];

    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    get(url) {
        // var self = this;

        return this.$q((resolve, reject) => {
            this.$http.get(url).then((response) => {
                debugger
                if (response.status === 200) {
                    resolve(response.data.result);
                }
            });
        });
    }

}
 

export default APIService;