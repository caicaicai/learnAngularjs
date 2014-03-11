'use strict';

(function (app) {

    app.controller('system.password.controller', ['$scope', '$resource', 'Tips', 'api', function ($scope, $resource, Tips, api) {

        return {
            render: {
                original_password: '',
                new_password: '',
                confirm_password: ''
            },
            submit: function () {

                var $this = this;

                if ($this.new_password != $this.confirm_password) {
                    Tips.warning('确认密码与新密码不一致');
                    return;
                }

                var User = $resource(api.updatePassword);
                User.save({
                    password: $this.original_password,
                    new_password: $this.new_password,
                    confirm_password: $this.confirm_password
                }, function (result, headers) {
                    angular.extend($this, $this.render);
                    $scope.pwdForm.$setPristine();
                })

            }
        }

    }]);

})(angular.module('system.password', []));