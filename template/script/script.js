'use strict';
angular.module('App', [])
    .run(function() {
        // console.log('Im app run...');
    })
    .controller('ctrl', ['$scope',
        function($scope) {
            $scope.data = '112233aa';
        }
    ])
    .directive('editable', function() {
        return {
            scope: {
                'data': '=editable',
            },
            restrict: 'A',
            templateUrl: 'template/editable.html',
            controller: function($scope, $element, $attrs) {
                $scope.directiveTempData = angular.copy($scope.data);
                $scope.setEdit = function() {
                    $scope.isEdit = true;
                    setTimeout(function() {
                        $element.children()[0].focus();
                    }, 10);
                }
                $scope.setCancel = function() {
                    $scope.data = angular.copy($scope.directiveTempData);
                    $scope.isEdit = false;
                }
                $($element.children()[0]).focusout(function() {
                    $scope.isEdit = false;
                    $scope.$apply();
                })

            }
        }
    })