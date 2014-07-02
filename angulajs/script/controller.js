"use strict";
(function(){
	var a = {};
	a = angular.module('App',[]);

	a.controller('ctrl',['clientId','clientIdFactory',function(clientId,clientIdFactory){
		console.log(clientId);
		console.log(clientIdFactory);
	}])

	a.value('clientId', 'a1234561x');

	a.factory('clientIdFactory',function(){
		return 'a1234561x-from-factory';
	});
})()

