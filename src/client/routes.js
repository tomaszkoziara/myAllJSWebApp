routes.$inject = ["$stateProvider", "$urlRouterProvider"];

export default function routes($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider
        .state("main", {
            url: "/",
            template: "<h1>Main</h1>"
        }).state("users", {
            url: "/users",
            template: require("./users/users.html")
        });
}