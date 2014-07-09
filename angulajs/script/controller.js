"use strict";
(function(){
	var a = {};
	a = angular.module('App',[]);

	a.controller('ctrl',['$scope','clientId','clientIdFactory',function($scope,clientId,clientIdFactory){
		$scope.clientId = clientId;
		this.client =clientId;
		console.log(clientId);
		console.log(clientIdFactory);

		console.log('....');
	}])

	a.value('clientId', 'a1234561x');

	a.factory('clientIdFactory',function(){
		return 'a1234561x-from-factory';
	});
	a.factory('apiToken', ['clientId', function apiTokenFactory(clientId) {
	  var encrypt = function(data1, data2) {
	    // NSA-proof encryption algorithm:
	    return (data1 + ':' + data2).toUpperCase();
	  };

	  var secret = window.localStorage.getItem('myApp.secret');
	  var apiToken = encrypt(clientId, secret);

	  return apiToken;
	}]);
})()

