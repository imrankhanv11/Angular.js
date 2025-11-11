angular.module('myApp').controller('PracticeController', function ($scope) {
    $scope.msg = "Hello Practice";

    $scope.users = [
        { name: 'Imran Khan', email: 'imran@example.com', role: 'Developer' },
        { name: 'Aisha', email: 'aisha@example.com', role: 'Designer' },
        { name: 'Rahul', email: 'rahul@example.com', role: 'Tester' }
    ];
});
