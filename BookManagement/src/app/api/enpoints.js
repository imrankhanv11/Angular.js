(function () {
    'use strict';

    angular
        .module('myApp')
        .constant('Endpoints', {
            BASE_URL: "http://localhost:5007/api",

            BOOK: {
                GET_ALL: "/Books/GellAllBooks",
                CREATE: "/Books/AddBook",
                UPDATE: "/Books/UpdateBook",
                DELETE: "/Books/DeleteBook/"
            },

            USER: {
                LOGIN: "/Login/LoginUser",
                REGISTER: "/Login/RegisterUser",
                REFRESH: "/Login/RefreshToken"
            },

            CAT:{
                GET_ALL: "/Categorys/GetAllCategory",
                DELETE :`/Categorys/DeleteCategory/`,
            }
        });

})();
