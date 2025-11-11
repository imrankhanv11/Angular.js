angular.module('myApp').controller('HomeController', function ($scope) {
    $scope.message = "Hello 6 Home";

    var vm = this;

    vm.users = [
        { name: 'Imran Khan', email: 'imran@example.com', role: 'Developer' },
        { name: 'Aisha', email: 'aisha@example.com', role: 'Designer' },
        { name: 'Rahul', email: 'rahul@example.com', role: 'Tester' }
    ];
});
