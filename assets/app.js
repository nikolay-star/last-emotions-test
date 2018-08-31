$(document).ready(function () {
	
	// parse json
	
	// if ( $('.chart-page').length ) {
	// 	$.getJSON( "all.json", function() {
	// 		//	$.getJSON( "http://18.218.159.157:8001/emotionsData", function() {// тут попытка get-запроса
	// 	}).done(function(json) {
	// 		dataObj = json;
	// 		arrSorted = json;
	// 		initObj(dataObj);
	// 		initObj(arrSorted);
	// 		//arrLength = arrSorted.length;
	// 		initChartArrays(dataObj);
	// 		initCharts();
	// 		initFilters(dataObj);
	// 	});
	// }
	
	
	var $loginform = $( "#loginform" );
	
	$loginform.on('submit', function (e) {
		e.preventDefault();
		
		$.post( "http://18.218.159.157:8001/emotionsData",  // тут url для логина
			$loginform.serialize()
		).done(function(json) {
			
			$('.login-modal').hide();
			
			if ( $('.chart-page').length ) {
				
				dataObj = json;
				arrSorted = json;
				initObj(dataObj);
				initObj(arrSorted);
				//arrLength = arrSorted.length;
				initChartArrays(dataObj);
				initCharts();
				initFilters(dataObj);
				
			}
			
		}).fail(function() {
			alert( "Wrong email or password. Try again" );
		});
	});
	
	
	
	// colors
	
	var bgColors = [
		'rgba(255, 99, 132, 0.2)',
		'rgba(54, 162, 235, 0.2)',
		'rgba(255, 206, 86, 0.2)',
		'rgba(75, 192, 192, 0.2)',
		'rgba(153, 102, 255, 0.2)',
		'rgba(255, 159, 64, 0.2)',
		
		'rgba(55, 99, 132, 0.2)',
		'rgba(4, 162, 235, 0.2)',
		'rgba(55, 206, 86, 0.2)',
		'rgba(5, 192, 192, 0.2)',
		'rgba(53, 102, 255, 0.2)',
		'rgba(55, 159, 64, 0.2)',
	];
	var borderColors = [
		'rgba(255,99,132,1)',
		'rgba(54, 162, 235, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
		
		'rgba(55,99,132,1)',
		'rgba(4, 162, 235, 1)',
		'rgba(55, 206, 86, 1)',
		'rgba(5, 192, 192, 1)',
		'rgba(53, 102, 255, 1)',
		'rgba(55, 159, 64, 1)',
	];
	
	// vars
	
	var genderData = {
		'man': 0,
		'woman': 0,
		'not specified': 0
	};
	
	var genderSorted = [];
	
	arrSorted = [];
	
	arrLength = 0;
	
	var emotions = {
		"happy": 0,
		"surprised": 0,
		"sad": 0,
		"disappointed": 0,
		"afraid": 0,
		//"neutro": 0,
		"angry": 0
	};
	
	var countriesData = {};
	
	var ageData = {
		'<18' : 0,
		'18-24' : 0,
		'25-35' : 0,
		'36-50' : 0,
		'>50' : 0,
		'not specified' : 0
	};
	
	var dataObj = [];
	
	var filters = {
		gender: -1,
		emotions: -1,
		countries: -1,
		age: -1,
		expId: -1,
		dates: -1
	};
	
	
	// countries
	
	var countriesArr = {};
	
	// exp
	
	var expArr = {};
	
	var activeFilters = false;
	
	var happyData = {};
	var surprisedData = {};
	var sadData = {};
	var disappointedData = {};
	var afraidData = {};
	var angryData = {};
	
	var happyDays = [];
	
	// actions
	
	var $body = $('body');
	
	$body.on('change', '.js-gender', function () {
		filters.gender = parseInt( $(this).val() );
		
		startFiltering();
	});
	
	$body.on('change', '.js-age-min, .js-age-max', function () {
		startFiltering();
	});
	
	$body.on('change', '.js-country, .js-exp', function () {
		startFiltering();
	});
	
	// $body.on('change', '.js-em', function () {
	// 	startFilteringEm();
	// 	initChartArrays( dataObj );
	// 	emotionsChart.config.data.labels = Object.keys(emotions);
	// 	emotionsChart.data.datasets[0].data = emotionsCreateArr(emotions);
	// 	emotionsChart.update();
	// });
	//
	// init data object (add filter keys
	
	function initObj(data) {
		data.forEach(function(item, i, arr) {
			item.hidden = filters;
		});
	}
	
	function startFiltering() {
		activeFilters = true;
		clearObjects();
		initChartArrays( dataObj );
		updateCharts();
	}
	
	// function startFilteringEm() {
	// 	var $emAll = $('.js-em');
	// 	var $emChecked = $('.js-em:checked');
	//
	// 	emotions = {};
	//
	// 	if ($emChecked.length) {
	// 		$emChecked.each(function (i) {
	// 			emotions[ $(this).val() ] = 0;
	// 		})
	// 	} else {
	// 		$emAll.each(function () {
	// 			emotions[ $(this).val() ] = 0;
	// 		})
	// 	}
	// }
	
	function emotionsCreateArr(emotions) {
		var dataLength = arrLength;
		
		return $.map( emotions, function (item) {
			return item/dataLength
		});
	}
	
	// clear
	
	function clearObjects() {
		
		arrLength = 0;
		
		for (let key in genderData){
			genderData[key] = 0
		}
		
		for (let key in ageData){
			ageData[key] = 0
		}
		
		for (let key in expArr){
			expArr[key] = 0
		}
		
		for (let key in countriesArr){
			countriesArr[key] = 0
		}
		
		//console.log(emotions);
		
		for (let key in emotions){
			emotions[key] = 0
		}
		
		//console.log(emotions);
		
	}
	
	// update charts
	
	function updateCharts() {
		genderChart.data.datasets[0].data = Object.values(genderData);
		ageChart.data.datasets[0].data = Object.values(ageData);
		emotionsChart.data.datasets[0].data = emotionsCreateArr(emotions);
		experienceChart.data.datasets[0].data = Object.values(expArr);
		countriesChart.data.datasets[0].data = Object.values(countriesArr);
		
		genderChart.update();
		ageChart.update();
		emotionsChart.update();
		experienceChart.update();
		countriesChart.update();
	}
	
	// for filters
	
	function checkVisibility(item) {
		// gender
		var visibleG = item.demographics[0].gender == filters.gender || filters.gender == '-1';
		
		// age
		var visibleA = '1';
		var itemAge = item.demographics[0].age;
		
		var minVal = $('.js-age-min').val();
		var maxVal = $('.js-age-max').val();
		
		switch (true) {
			case (itemAge >= minVal && itemAge < maxVal) :
				visibleA = true;
				break;
			case (itemAge < minVal || itemAge > maxVal) :
				visibleA = false;
				break;
			default :
				visibleA = true;
				break;
		}
		
		// country
		
		var visibleC = '1';
		var itemCountry = item.sessionData.country;
		var $countiesChecked = $('.js-country:checked');
		
		if ($countiesChecked.length) {
			$countiesChecked.each(function () {
				if ( itemCountry == $(this).val() ) {
					visibleC = true;
					return false
				} else {
					visibleC = false
				}
			})
		} else {
			visibleC = true;
		}
		
		// expId
		
		var visibleExp = '1';
		var itemExp = item.emotions[0].experienceID;
		var $expChecked = $('.js-exp:checked');
		
		//console.log( $expChecked.length );
		
		if ($expChecked.length) {
			$expChecked.each(function () {
				if ( itemExp == $(this).val() ) {
					visibleExp = true;
					return false
				} else {
					visibleExp = false
				}
			})
		} else {
			visibleExp = true;
		}
		
		// dates
		
		var minDate = dateToTimestamp( $('.slider-time').text() );
		var maxDate = dateToTimestamp( $('.slider-time2').text() );
		var visibleD = true;
		var itemDate = item.sessionData.timestamp;
		
		// console.log(timestampToDate( minDate ));
		// console.log(timestampToDate( maxDate ));
		//
		// console.log(timestampToDate( itemDate ));
		//
		// console.log(minDate <= itemDate);
		//
		// console.log(itemDate >= maxDate);
		//
		// console.log('---/t');
		
		if ( minDate <= itemDate && itemDate <= maxDate ) {
			visibleD = true
		} else {
			visibleD = false;
		}
		
		//console.log(filters.age);
		
		var visible = visibleG && visibleA && visibleC && visibleExp && visibleD;
		
		return visible;
	}
	
	
	// init chart
	
	function initChartArrays(data) {
		
		
		data.forEach(function(item, i, arr) {
			
			// if (!activeFilters || arrSorted[i].hidden.gender != 'hidden') {
			if (!activeFilters || checkVisibility(item) ) {
				arrLength++;
				
				switch (true) {
					case (item.demographics[0].gender == 1 ) : genderData['man']++;
						break;
					case (item.demographics[0].gender == 2 ) : genderData['woman']++;
						break;
					case (item.demographics[0].gender == 0 )  : genderData['not' +
					' specified']++;
						break;
				}
				
				// age
				
				switch (true) {
					case (item.demographics[0].age > 0 && item.demographics[0].age < 18) :
						ageData['<18']++;
						break;
					case (item.demographics[0].age >= 18 && item.demographics[0].age < 25) :
						ageData['18-24']++;
						break;
					case (item.demographics[0].age >= 25 && item.demographics[0].age < 35) :
						ageData['25-35']++;
						break;
					case (item.demographics[0].age >= 35 && item.demographics[0].age < 50) :
						ageData['36-50']++;
						break;
					case (item.demographics[0].age >= 50) :
						ageData['>50']++;
						break;
					default :
						ageData['not specified']++;
						break;
				}
				
				// emotions
				
				
				for (var em_key in emotions) {
					
					if (em_key != 'neutro') {
						emotions[em_key] += item.emotions[0][em_key];
					}
					
				}
				
				// countries
				
				if ( ! countriesArr[item.sessionData.country] ){
					countriesArr[item.sessionData.country] = 1;
				} else {
					countriesArr[item.sessionData.country] += 1
				}
				
				
				// exp id
				
				if ( ! expArr[item.emotions[0].experienceID] ){
					expArr[item.emotions[0].experienceID] = 1
				} else {
					expArr[item.emotions[0].experienceID] += 1
				}
				
				// emotions and dates
				
				var itemDay = timestampToDay( item.sessionData.timestamp );
				
				//console.log(item.emotions[0].happy);
				
				//console.log( happyData[itemDay] );
				
				if ( typeof happyData[itemDay]  !== 'object' ){
					happyData[itemDay] = {};
					happyData[itemDay].values = 0;
					happyData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].happy === 'number') {
						happyData[itemDay].values += item.emotions[0].happy;
						happyData[itemDay].valuesLength += 1;
					}
				}
				
				
				if ( typeof surprisedData[itemDay]  !== 'object' ){
					surprisedData[itemDay] = {};
					surprisedData[itemDay].values = 0;
					surprisedData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].surprised === 'number') {
						surprisedData[itemDay].values += item.emotions[0].surprised;
						surprisedData[itemDay].valuesLength += 1;
					}
				}
				
				
				
				if ( typeof sadData[itemDay]  !== 'object' ){
					sadData[itemDay] = {};
					sadData[itemDay].values = 0;
					sadData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].surprised === 'number') {
						sadData[itemDay].values += item.emotions[0].sad;
						sadData[itemDay].valuesLength += 1;
					}
				}
				
				
				if ( typeof disappointedData[itemDay]  !== 'object' ){
					disappointedData[itemDay] = {};
					disappointedData[itemDay].values = 0;
					disappointedData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].disappointed === 'number') {
						disappointedData[itemDay].values += item.emotions[0].disappointed;
						disappointedData[itemDay].valuesLength += 1;
					}
				}
				
				
				if ( typeof afraidData[itemDay]  !== 'object' ){
					afraidData[itemDay] = {};
					afraidData[itemDay].values = 0;
					afraidData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].afraid === 'number') {
						afraidData[itemDay].values += item.emotions[0].afraid;
						afraidData[itemDay].valuesLength += 1;
					}
				}
				
				
				if ( typeof angryData[itemDay]  !== 'object' ){
					angryData[itemDay] = {};
					angryData[itemDay].values = 0;
					angryData[itemDay].valuesLength = 0;
					//console.log(happyData[itemDay]);
				} else {
					if (typeof item.emotions[0].angry === 'number') {
						angryData[itemDay].values += item.emotions[0].angry;
						angryData[itemDay].valuesLength += 1;
					}
				}
			}
			
		});
		
		// console.log(
		// 	$.map(happyData, function (value, key) {
		// 		var newItem = {
		// 			'x' : key,
		// 			'y' : value.values/value.valuesLength
		// 		};
		//
		// 		return newItem
		// 	})
		// );
	}
	
	
	
	// init charts
	
	function initCharts() {
		
		// emotions
		
		var ctx = document.getElementById("emotionsChart").getContext('2d');
		emotionsChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: Object.keys(emotions),
				datasets: [{
					label: '',
					data: emotionsCreateArr(emotions),
					backgroundColor: bgColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: {
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						ticks: {
							//beginAtZero: true
						}
					}]
				}
			}
		});
		
		// experiance id
		
		var ctx_exp = document.getElementById("experienceChart").getContext('2d');
		experienceChart = new Chart(ctx_exp, {
			type: 'bar',
			data: {
				labels: Object.keys(expArr),
				datasets: [{
					label: '',
					data: Object.values(expArr),
					backgroundColor: bgColors,
					borderColor: borderColors,
					borderWidth: 1
				}]
			},
			options: {
				legend: {
					display : false
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
		
		// countries
		
		var ctx_countries = document.getElementById("countriesChart").getContext('2d');
		countriesChart = new Chart(ctx_countries, {
			type: 'bar',
			data: {
				labels: Object.keys(countriesArr),
				datasets: [{
					label: '',
					data: Object.values(countriesArr),
					backgroundColor: bgColors,
					borderColor: borderColors,
					
					borderWidth: 1
				}]
			},
			options: {
				legend: {
					display : false
				},
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		});
		
		
		// gender
		
		var ctx_gender = document.getElementById("genderChart").getContext('2d');
		genderChart = new Chart(ctx_gender, {
			type: 'pie',
			data: {
				labels: Object.keys(genderData),
				datasets: [{
					label: '',
					data: Object.values(genderData),
					backgroundColor: bgColors,
					borderWidth: 0
				}]
			},
			options: {
				legend: {
					//display : false
				},
			}
		});
		
		// age
		
		var ctx_age = document.getElementById("agesChart").getContext('2d');
		ageChart = new Chart(ctx_age, {
			type: 'pie',
			data: {
				labels: Object.keys(ageData),
				datasets: [{
					label: '',
					data: Object.values(ageData),
					backgroundColor: bgColors,
					borderWidth: 0
				}]
			},
			options: {
				legend: {
					//display : false
				},
			}
		});
		
		// emotions and dates
		
		var ctxED = document.getElementById("emotionsDatesChart").getContext('2d');
		emotionsDatesChart = new Chart(ctxED, {
			type: 'line',
			data: {
				labels: Object.keys(happyData),
				datasets: [{
					label: 'Happy',
					backgroundColor: bgColors[0],
					borderColor: borderColors[0],
					fill: false,
					data: $.map(happyData, function (value, key) {
						var newItem = {
							'x' : key,
							'y' : value.values/value.valuesLength
						};
						
						return newItem
					})
				},
					{
						label: 'Surprised',
						backgroundColor: bgColors[1],
						borderColor: borderColors[1],
						fill: false,
						data: $.map(surprisedData, function (value, key) {
							var newItem = {
								'x' : key,
								'y' : value.values/value.valuesLength
							};
							
							return newItem
						})
					},
					{
						label: 'Sad',
						backgroundColor: bgColors[2],
						borderColor: borderColors[2],
						fill: false,
						data: $.map(sadData, function (value, key) {
							var newItem = {
								'x' : key,
								'y' : value.values/value.valuesLength
							};
							
							return newItem
						})
					},
					{
						label: 'Disappointed',
						backgroundColor: bgColors[3],
						borderColor: borderColors[3],
						fill: false,
						data: $.map(disappointedData, function (value, key) {
							var newItem = {
								'x' : key,
								'y' : value.values/value.valuesLength
							};
							
							return newItem
						})
					},
					{
						label: 'Afraid',
						backgroundColor: bgColors[4],
						borderColor: borderColors[4],
						fill: false,
						data: $.map(afraidData, function (value, key) {
							var newItem = {
								'x' : key,
								'y' : value.values/value.valuesLength
							};
							
							return newItem
						})
					},
					{
						label: 'Angry',
						backgroundColor: bgColors[5],
						borderColor: borderColors[5],
						fill: false,
						data: $.map(angryData, function (value, key) {
							var newItem = {
								'x' : key,
								'y' : value.values/value.valuesLength
							};
							
							return newItem
						})
					}
				]
			},
			options: {
				title: {
					text: 'Time Scale'
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'value'
						}
					}]
				},
			}
		});
		
		
	}
	
	
	// filters

	function initFilters(data) {
		
		//exp
		
		var expArr = {};
		var emArr = data[0].emotions[0];
		var countriesArr = {};
		var $expContainer = $('.exp-checkboxes');
		var $emContainer = $('.em-checkboxes');
		var $countriesContainer = $('.countries-checkboxes');
		
		data.forEach(function(item, i, arr) {
			// exp id
			
			if ( ! expArr[item.emotions[0].experienceID] ){
				expArr[item.emotions[0].experienceID] = 1;
			}
			
			// countries
			
			if ( ! countriesArr[item.sessionData.country] ){
				countriesArr[item.sessionData.country] = 1;
			}
			
		});
		
		// exp id
		
		Object.keys(expArr).forEach(function (item, i, arr) {
			addExpCheckbox(item, i);
		});
		
		function addExpCheckbox(el, i) {
			var $expCheckbox = $('<div class="form-check form-check-inline">' +
				'<input class="form-check-input js-exp" type="checkbox" id="expCheck_' + i + '" value="' + el + '">' +
				'<label class="form-check-label" for="expCheck_' + i + '">'+ el +'</label>' +
				'</div>');
			
			$expContainer.append($expCheckbox);
		}
		
		// countries
		
		Object.keys(countriesArr).forEach(function (item, i, arr) {
			addCountryCheckbox(item, i);
		});
		
		function addCountryCheckbox(el, i) {
			var $cCheckbox = $('<div class="form-check form-check-inline">' +
				'<input class="form-check-input js-country" type="checkbox" id="cCheck_' + i + '" value="' + el + '">' +
				'<label class="form-check-label" for="cCheck_' + i + '">'+ el +'</label>' +
				'</div>');
			
			$countriesContainer.append($cCheckbox);
		}
		
		// emotions
		
		Object.keys(emArr).forEach(function (item, i, arr) {
			
			if ( item !== 'time' && item !== 'experienceID' ) {
				addEmCheckbox(item, i);
			}
			
		});
		
		function addEmCheckbox(el, i) {
			var $emCheckbox = $('<div class="form-check form-check-inline">' +
				'<input class="form-check-input js-em" type="checkbox" id="emCheck_' + i + '" value="' + el + '">' +
				'<label class="form-check-label" for="emCheck_' + i + '">'+ el +'</label>' +
				'</div>');
			
			$emContainer.append($emCheckbox);
		}
	}
	
	
	/// jquery ui slider for age
	
	$( function() {
		
		var dt_from = new Date('2018/08/01');
		var dt_to = new Date();
		
		$('.slider-time').html(formatDT(dt_from));
		$('.slider-time2').html(formatDT(dt_to));
		var min_val = Date.parse(dt_from)/1000;
		var max_val = Date.parse(dt_to)/1000;
		
		
		function formatDT(__dt) {
			var year = __dt.getFullYear();
			var month = zeroPad(__dt.getMonth()+1, 2);
			var date = zeroPad(__dt.getDate(), 2);
			
			return date + '/' + month + '/' + year;
		}
		
		$("#slider-range").slider({
			range: true,
			min: min_val,
			max: max_val,
			step: 10,
			values: [min_val, max_val],
			slide: function (e, ui) {
				var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
				$('.slider-time').html(formatDT(dt_cur_from));
				
				var dt_cur_to = new Date(ui.values[1]*1000); //.format("yyyy-mm-dd hh:ii:ss");
				$('.slider-time2').html(formatDT(dt_cur_to));
				
				startFiltering();
			}
		});
		
	});
	
	
	// timestamp to date
	
	function timestampToDate(timestamp) {
		var newDate = new Date();
		
		newDate.setTime(timestamp*1000);
		
		var year = newDate.getFullYear();
		var month = zeroPad(newDate.getMonth()+1, 2);
		var date = zeroPad(newDate.getDate(), 2);
		
		return date + '/' + month + '/' + year;
	}
	
	// timestamp to day
	
	function timestampToDay(timestamp) {
		var newDate = new Date();
		
		newDate.setTime(timestamp*1000);
		
		var year = newDate.getFullYear();
		var month = zeroPad(newDate.getMonth()+1, 2);
		var date = zeroPad(newDate.getDate(), 2);
		
		return date + '/' + month + '/' + year;
	}
	
	// date to timestamp
	
	function dateToTimestamp(myDate) {
		myDate=myDate.split("/");
		var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
		return new Date(newDate).getTime() / 1000;
	}
	
	function zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}
	
	// var newDate = new Date();
	// newDate.setTime( 1534228061*1000 );
	//
	// console.log(newDate);
	
	
});

