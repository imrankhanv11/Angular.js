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

    CatAddController.$inject = ['CatService', '$location', '$routeParams'];
    function CatAddController(CatService, $location, $routeParams) {
        var $ctrl = this;

        $ctrl.categoryName = '';
        $ctrl.isEditMode = false;


        if ($routeParams.id) {
            $ctrl.isEditMode = true;
            const updateCat = CatService.getCatById(Number($routeParams.id));
            $ctrl.categoryName = updateCat.categoryName;
        }

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


            if ($ctrl.isEditMode) {
                CatService.updateCatName({
                    categoryName: $ctrl.categoryName,
                    Id: Number($routeParams.id)
                })
                    .then(() => {
                        $location.path('/');
                    })
                    .catch((error) => console.log(error));
            }
            else {
                CatService.addCat({ categoryName: $ctrl.categoryName })
                    .then(() => {
                        $location.path('/admincat');
                    })
                    .catch((error) => console.log(error));

            }
        }
    }
})();