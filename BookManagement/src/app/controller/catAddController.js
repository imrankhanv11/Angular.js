(function () {
    'use strict';
    angular
        .module('myApp')
        .component('appCatadd', {
            templateUrl: 'app/view/catAdd.html',
            controller: CatAddController,
            controllerAs: '$ctrl',
            bindings: {
                Binding: '=',
            },
        });

    CatAddController.$inject = ['CatService', '$location'];
    function CatAddController(CatService, $location) {
        var $ctrl = this;

        $ctrl.categoryName = '';

        $ctrl.formSubmit = function () {
            if ($ctrl.catFormAdd && $ctrl.catFormAdd.$invalid) {
                angular.forEach($ctrl.catFormAdd, function (field, fieldName) {
                    if (fieldName[0] !== '$' && field.$setTouched) {
                        field.$setTouched();
                    }
                });
                console.log("error");
                return;
            }
            console.log($ctrl.categoryName);
            CatService.addCat({ categoryName: $ctrl.categoryName })
                .then(() => {
                    $location.path('/admincat');
                })
                .catch((error) => console.log(error));

        }
    }
})();