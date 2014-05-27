'use strict';
angular.module('App', [])
    .run(function() {
        console.log('Im app run...');
    })
    .controller('ctrl', ['$scope',
        function($scope) {
            $scope.data = '112233aa';
        }
    ])
    .directive('dire', function() {
        return {
            template: '<div>Im a new template!</div>',
        }
    })
    .directive('editable', function() {
        return {
            scope: {
                'data': '=editable',
            },
            restrict: 'A',
            templateUrl: 'template/editable.html',
            controller: function($scope, $element, $attrs) {
                $scope.setEdit = function() {
                    console.log('is setting editable!');
                    $scope.data = 222;
                }
            },
            link: function(s, e, a) {
                console.log(s.data);
                console.log(s);
            }
        }
    })