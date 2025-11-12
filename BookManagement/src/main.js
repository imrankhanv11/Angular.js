angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/view/home.html',
                controller: 'HomeController'
            })
            .when('/login', {
                templateUrl: 'app/view/login.html',
                controller: 'LoginController'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.interceptors.push('authInterceptor');
    });
