(function () {
    'use strict';

    angular
        .module('myApp')
        .component('appAdmincat', {
            templateUrl: 'app/view/adminCatPage.html',
            controller: AdminCatController,
            controllerAs: '$ctrl',
            bindings: {
                Binding: '=',
            },
        });

    AdminCatController.$inject = ['CatService'];
    function AdminCatController(CatService) {
        var $ctrl = this;

        $ctrl.Cat = [];

        CatService.getCat()
            .then(function (data) {
                $ctrl.Cat = data;
            })
    }
})();