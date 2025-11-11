(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('AboutController', aboutController);

    aboutController.$inject = ['$scope'];
    function aboutController($scope) {
        $scope.message = "Hello About";
    }
})();