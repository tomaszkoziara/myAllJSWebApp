routes.$inject = ["$stateProvider", "$urlRouterProvider"];

export default function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/lots");

    $stateProvider
        .state("users", {
            url: "/users",
            template: require("./users/users.html")
        }).state("lots", {
            url: "/lots",
            template: require("./lots/lots.html")
        }).state("lot", {
            url: "/lot/{id}",
            template: require("./lots/lot.html")
        }).state("version", {
            url: "/lot/{id}/version",
            template: require("./versions/version.html")
        });
}