'use strict';

(function (app) {

    app.controller('stats.controller', ['$scope', 'Loader', 'api', function ($scope, Loader, api) {
        console.log('api-stats', api);
        Loader.html(['/assets/views/dashboard/index.html', '/assets/views/dashboard/stats.html'], function (result) { console.log(result) })
        $scope.value = api;
    }]);

})(angular.module('stats', []));