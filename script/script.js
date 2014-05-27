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
                    $scope.isEdit = true;
                    $scope.directiveTempData = angular.copy($scope.data);
                }
                $scope.setOK = function() {
                    $scope.isEdit = false;
                }
                $scope.setCancel = function() {
                    $scope.data = angular.copy($scope.directiveTempData);
                    $scope.isEdit = false;
                }
                $(".directive-data-input").focusout(function(){
                    $scope.setOK();
                    $scope.$apply();
                })
            },
            link: function(s, e, a) {
                console.log(s.data);
                console.log(s);
            }
        }
    })