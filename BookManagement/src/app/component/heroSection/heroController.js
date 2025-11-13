(function () {
    'use strict';

    angular
        .module('myApp')
        .component('heroSection', {
            templateUrl: 'app/component/heroSection/hero.html',
            controller: HeroController,
            controllerAs: 'hero'
        });

    HeroController.$inject = ['$location'];

    function HeroController($location) {
        var hero = this;

        hero.title = "Book Management System";
        hero.subtitle = "Easily manage your books, add new titles, track availability, and keep everything organized.";
        hero.ctaText = "Get Started";

        hero.goToAddBook = function () {
            $location.path('/addbook');
        };
    }
})();
