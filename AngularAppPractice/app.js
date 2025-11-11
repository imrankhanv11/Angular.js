// app.js
angular.module('myApp', ['ngRoute'])
    .config(function ($routeProvider) {
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
            .when('/practice', {
                templateUrl: 'view/practice.html',
                controller: 'PracticeController',
                // controllerAs: 'pc'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
