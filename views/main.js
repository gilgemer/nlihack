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

function submit() {
	var date = document.getElementById('date');
	var parsedDate = moment(date.value, ['DDMMMMY', 'MMMMDDY',
										'YMMMMDD', 'YDDMMMMM',
										'DD:MM:YY', 'DD.MM.YY', 'DD-MM-YY', 'DD/MM/YY', 
										'DD:MM:Y', 'DD.MM.Y', 'DD-MM-Y', 'DD/MM/Y',
										'YY:MM:DD', 'YY.MM.DD', 'YY-MM-DD', 'YY/MM/DD',
										'Y:MM:DD', 'Y.MM.DD', 'Y-MM-DD', 'Y/MM/DD']).locale('he').format();
	console.log(parsedDate);
}

function dateToInput() {
	var date = document.getElementById('datePicker');
	date = document.getElementById('date').value = date.value;
	
}