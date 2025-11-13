angular.module('myApp')
.config(function ($routeProvider, $httpProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/view/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'app/view/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .when('/addbook', {
            templateUrl: 'app/view/bookAdd.html',
            controller: 'BookAddController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push('authInterceptor');
});
