var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'view/home.html',
            controller: 'HomeController'
        })
        .when('/about', {
            templateUrl: 'view/about.html',
            controller: 'AboutController'
        })
        .when('/contact', {
            templateUrl: 'view/contact.html',
            controller: 'ContactController'
        })
        .otherwise({
            redirectTo: '/'
        });
});
