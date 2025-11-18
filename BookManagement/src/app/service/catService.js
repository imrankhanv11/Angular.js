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

        this.deleteCat = function (id) {
            return $http.delete(`${Endpoints.BASE_URL}${Endpoints.CAT.DELETE}${id}`)
                .then(() => {
                    state.Cat = state.Cat.filter(s => {
                        return s.categoryId !== id
                    });
                    return state.Cat;
                })
                .catch((error) => {
                    console.error('Error in Delete Cat:', error);
                    throw error;
                });
        };

        this.addCat = function (data) {
            return $http.post(`${Endpoints.BASE_URL}${Endpoints.CAT.CREATE}`, data)
                .then(() => {
                    state.Cat.push(data);
                    return state.Cat;
                })
                .catch((error) => {
                    console.error('Error in Add Cat:', error);
                    throw error;
                });
        }
    }
})();