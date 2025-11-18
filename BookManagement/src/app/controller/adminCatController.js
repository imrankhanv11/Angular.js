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

        $ctrl.deleteCat = function (id) {
            if (confirm("Do you Want to delete?")) {
                CatService.deleteCat(id).then(function (data) {
                    $ctrl.Cat = data;
                });
            }
        };

        $ctrl.editCat = function (id) {
            // $location.path('addbook/' + id);
            console.log("Edited", id);
        }
    }
})();