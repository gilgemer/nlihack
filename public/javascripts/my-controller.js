'use strict';

var events  = {'' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',
			   '' : '',}

function MyController($scope, $http) {

		 
	$scope.submit = function() {
		var date = $scope.date;
		var parsedDate = moment(date, ['DDMMMMY', 'MMMMDDY',
											'YMMMMDD', 'YDDMMMMM',
											'DD:MM:YY', 'DD.MM.YY', 'DD-MM-YY', 'DD/MM/YY', 
											'DD:MM:Y', 'DD.MM.Y', 'DD-MM-Y', 'DD/MM/Y',
											'YY:MM:DD', 'YY.MM.DD', 'YY-MM-DD', 'YY/MM/DD',
											'Y:MM:DD', 'Y.MM.DD', 'Y-MM-DD', 'Y/MM/DD']).locale('he').format();
			var day = $scope.date.getDate();
			var month = $scope.date.getMonth();
			$http({
				url : "http://localhost:34309/api/fetch",
				method : "GET",
				params : { 'day' : day,
						   'month' : month}})
						   .then(function(res) {
							  $scope.urls = res.data;							  
						   });;
	};	 
}