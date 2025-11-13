(function () {
    'use strict';
    angular
        .module('myApp')
        .component('appFooter', {
            templateUrl: 'app/layouts/footer/footer.html',
            controller: FooterController,
        });

    FooterController.$inject = [];
    function FooterController() {

    }
})();