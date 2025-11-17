(function () {
    'use strict';

    angular
        .module('myApp')
        .service('CatService', CatService);

    CatService.$inject = ['$http', 'Endpoints'];
    function CatService($http, Endpoints) {
        var state = {
            Cat: []
        };

        this.state = state;

        this.getCat = function () {
            return $http.get(`${Endpoints.BASE_URL}${Endpoints.CAT.GET_ALL}`)
                .then((response) => {
                    state.Cat = response.data;
                    return state.Cat;
                })
                .catch((error) => {
                    console.error('Error fetching Cat:', error);
                    throw error;
                });
        };
    }
})();