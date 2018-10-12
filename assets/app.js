$(document).ready(function () {
	
	// bert formula
	
	function bertFunc(happy, surprised, sad, dissapointed, afraid, angry) {
		
		// делим на 100, чтобы перевести из процентов в доли
		var bertResult = ((3*happy + surprised) - (sad + dissapointed + afraid + angry))/100;
		var logBert = bertResult >= 0 ? Math.log(10 * bertResult + 1) / Math.log(15) : -Math.log(-10 * bertResult + 1) / Math.log(15)
		
		
		//console.log(typeof logBert, ' ', logBert);
		
		if (isNaN(logBert)) {
			logBert = 0
		}
		
		// округляем до 3 знаков после запятой
		return parseInt(logBert * 1000) / 1000
	}
	
	/*
	
	 parse json
	 
	 */
	
	var $loginform = $("#loginform");
	var $guestform = $("#guest-form");
	
	$loginform.on('submit', function (e) {
		var event = e;
		var $form = $(this);
		
		submitHandler(event, $form);
		
		setInterval(function(){
			updatePage($form)
		}, 60000)
	});
	
	$guestform.on('submit', function (e) {
		var event = e;
		var $form = $(this);
		
		submitHandler(event, $form);
		
		setInterval(function(){
			updatePage($form)
		}, 60000)
	});
	
	function submitHandler(e, $form) {
		e.preventDefault();
		$('.preloader').show();
		
		// $.post( "https://18.218.159.157:8001/emotionsData",  // тут url для логина
		// 	$form.serialize()
		// ).done(function(json) {
		//
		// 	$('.login-modal').hide();
		//
		// 	if ( $('.chart-page').length ) {
		//
		// 		dataObj = json;
		// 		arrSorted = json;
		// 		initChartArrays(dataObj);
		// 		initCharts();
		// 		initFilters(dataObj);
		//
		// 		$('.preloader').hide();
		//
		// 	}
		//
		// }).fail(function() {
		// 	alert( "Wrong email or password. Try again" );
		// 	$('.preloader').hide();
		// });
		
		$.ajax({
			type: 'POST',
			url: 'https://moodme.tk:8001/emotionsData',
			crossDomain: true,
			data: $form.serialize(),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				$('.login-modal').hide();
				
				if ( $('.chart-page').length ) {
					
					dataObj = responseData;
					arrSorted = responseData;
					initChartArrays(dataObj);
					initCharts();
					initFilters(dataObj);
					
					$('.preloader').hide();
					
				}
			},
			error: function (responseData, textStatus, errorThrown) {
				alert( "Wrong email or password. Try again" );
				$('.preloader').hide();
			}
		});
	}
	
	function updatePage($form){
		
		// $.post( "https://18.218.159.157:8001/emotionsData",  // тут url для логина
		// 	$form.serialize()
		// ).done(function(json) {
		//
		// 	dataObj = json;
		//
		// 	// console.log(dataObj);
		//
		// 	startFiltering();
		// })
		
		$.ajax({
			type: 'POST',
			url: 'https://moodme.tk:8001/emotionsData',
			crossDomain: true,
			data: $form.serialize(),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				
				dataObj = responseData;
				
				startFiltering();
			}
		});
		
	}
	
	function guestSubmit() {
		$guestform.submit();
	}
	
	$('.js-guest').on('click', function (e) {
		e.preventDefault();
		
		guestSubmit();
	});
	
	//guestSubmit();
	
	/*
	
	 exp id rename
	 
	 */
	
	var expIdRenamed = {
		'QQ-591' : 'Glasses Black',
		'QQ-920-a' : 'Glasses Pink',
	};
	
	/*
	
	 variables
	 
	 */
	
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
	
	var bgColorsBright = [
		'rgba(54, 162, 235, 1)',
		'rgba(255, 99, 132, 1)',
		'rgba(255, 206, 86, 1)',
		'rgba(75, 192, 192, 1)',
		'rgba(153, 102, 255, 1)',
		'rgba(255, 159, 64, 1)',
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
	
	
	var ageData = {
		'<18' : 0,
		'18-24' : 0,
		'25-35' : 0,
		'36-50' : 0,
		'>50' : 0,
		'not specified' : 0
	};
	
	var dataObj = [];
	
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
	
	/*
	
	 actions
	 
	 */
	
	var $body = $('body');
	
	$body.on('change', '.js-gender', function () {
		startFiltering();
	});
	
	$body.on('change', '.js-age-min, .js-age-max', function () {
		startFiltering();
	});
	
	$body.on('change', '.js-country, .js-exp', function () {
		startFiltering();
	});
	
	$body.on('click', '.js-btn-all', function () {
		var dt_from = new Date('2018/08/01');
		var dt_to = new Date();
		//dt_to.setDate((new Date()).getDate() + 1)
		
		$('.slider-time')
			.attr('data-value', formatDTmins(dt_from))
			.html(formatDT(dt_from));
		$('.slider-time2')
			.attr('data-value', formatDTmins(dt_to))
			.html(formatDT(dt_to));
		
		var min_val = Date.parse(dt_from)/1000;
		var max_val = Date.parse(dt_to)/1000;
		
		$("#slider-range").slider("option", "values", [ min_val, max_val ]);
		
	});
	
	$body.on('click', '.js-btn-last-minute', function () {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		var month = zeroPad( currentTime.getMonth() + 1, 2);
		var day = zeroPad( currentTime.getDate() , 2);
		var hours = zeroPad(currentTime.getHours(), 2);
		var minutes = zeroPad(currentTime.getMinutes() - 1, 2);
		var seconds = zeroPad(currentTime.getSeconds(), 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds);
		
		//console.log(dt_from);
		
		var lastMin = Date.parse(dt_from)/1000;
		
		$("#slider-range").slider("option", "values", [ lastMin, currentTime/1000 ]);
		
		$('.slider-time').html(day + '/' + month + '/' + year);
		
	});
	
	$body.on('click', '.js-btn-last-five-mins', function () {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		var month = zeroPad( currentTime.getMonth() + 1, 2);
		var day = zeroPad( currentTime.getDate() , 2);
		var hours = zeroPad(currentTime.getHours(), 2);
		var minutes = zeroPad(currentTime.getMinutes() - 5, 2);
		var seconds = zeroPad(currentTime.getSeconds(), 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds);
		//console.log(dt_from);
		
		var lastFiveM = Date.parse(dt_from)/1000;
		
		$("#slider-range").slider("option", "values", [ lastFiveM, currentTime/1000 ]);
		
		$('.slider-time').html(day + '/' + month + '/' + year);
		
		
		
	});
	
	$body.on('click', '.js-btn-last-ten-mins', function () {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		var month = zeroPad( currentTime.getMonth() + 1, 2);
		var day = zeroPad( currentTime.getDate(), 2);
		var hours = zeroPad(currentTime.getHours(), 2);
		var minutes = zeroPad(currentTime.getMinutes() - 10, 2);
		var seconds = zeroPad(currentTime.getSeconds(), 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds);
		//console.log(dt_from);
		
		var lastTenM = Date.parse(dt_from)/1000;
		
		$("#slider-range").slider("option", "values", [ lastTenM, currentTime/1000 ]);
		
		$('.slider-time').html(day + '/' + month + '/' + year);
		
		
		
	});
	
	$body.on('click', '.js-btn-last-day', function () {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		var month = zeroPad( currentTime.getMonth() + 1, 2);
		var day = zeroPad( currentTime.getDate() - 1, 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day);
		
		var lastDay = Date.parse(dt_from)/1000;
		
		$("#slider-range").slider("option", "values", [ lastDay, currentTime/1000 ]);
		
		$('.slider-time').html(day + '/' + month + '/' + year);
		
		
	});
	
	$body.on('click', '.js-btn-last-week', function () {
		var currentTime = new Date();
		var previousweek= new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000);
		
		var year = previousweek.getFullYear();
		var month = zeroPad( previousweek.getMonth() + 1, 2);
		var day = zeroPad( previousweek.getDate(), 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day);
		var lastWeek = Date.parse(dt_from)/1000;
		
		//console.log(lastWeek);
		
		$("#slider-range").slider("option", "values", [ lastWeek, currentTime/1000 ]);
		
		$('.slider-time').html(day + '/' + month + '/' + year);
		
		
		
	});
	
	$body.on('click', '.js-btn-last-month', function () {
		var currentTime = new Date();
		var year = currentTime.getFullYear();
		var month = zeroPad( currentTime.getMonth(), 2);
		var day = zeroPad( currentTime.getDate(), 2);
		
		var dt_from = new Date(year + '/' + month + '/' + day);
		
		var lastMonth = Date.parse(dt_from)/1000;
		
		// $("#slider-range").slider({
		// 	values: [ lastMonth, currentTime/1000 ]
		// });
		
		$("#slider-range").slider("option", "values", [ lastMonth, currentTime/1000 ]);
		
		$('.slider-time')
			.html(day + '/' + month + '/' + year);
		
		//$('body').trigger('filteringDates');
		
		//console.log('click')
		
		//$('body').trigger('filteringDates');
	});
	
	
	$('body').on('filteringDates', function () {
	
	});
	
	$('.js-btn-date').on('click', function () {
		$('.js-btn-date.active').removeClass('active');
		$('.slider-time.active').removeClass('active');
		$(this).addClass('active')
	});
	
	/*
	
	 main
	 
	 */
	
	// helper function for colors
	
	var dynamicColors = function() {
		var arr = [];
		
		for (var i = 0; i<100; i++){
			var r = Math.floor(Math.random() * 255);
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255);
			arr.push("rgb(" + r + "," + g + "," + b + ")");
		}
		
		//console.log(arr);
		
		return arr;
	};
	
	// create chart arrays
	
	function initChartArrays(data) {
		
		data.forEach(function(item, i, arr) {
			
			// if (!activeFilters || arrSorted[i].hidden.gender != 'hidden') {
			if (!activeFilters || checkVisibility(item) ) {
				arrLength++;
				
				switch (true) {
					case ( !item.demographics.length ): genderData['not' +
					' specified']++;
						break;
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
					case ( !item.demographics.length ): ageData['not' +
					' specified']++;
						break;
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
				
				//
				// var itemCountry = item.sessionData.country;
				//
				// if ( ! countriesArr[ itemCountry ] ){
				// 	countriesArr[ itemCountry ] = 1
				// } else {
				// 	countriesArr[ itemCountry ] += 1
				// }
				
				
				// exp id
				
				var itemExpId = item.emotions[0].experienceID;
				
				Object.keys(expIdRenamed).forEach(function(item, i, arr) {
					if ( item == itemExpId ) {
						//console.log(nameItem);
						itemExpId = Object.values(expIdRenamed)[i];
					}
				});
				
				if ( ! expArr[ itemExpId ] ){
					expArr[ itemExpId ] = 1
				} else {
					expArr[ itemExpId ] += 1
				}
				
				// emotions and dates
				
				var itemDay = timestampToDay( item.sessionData.timestamp );
				
				
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
		
		bert(emotionsCreateArr(emotions));
		
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
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				scales: {
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'value (%)'
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
				maintainAspectRatio: false,
				
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
				labels: Object.keys(sortingCountriesByPopular( countriesArr )),
				datasets: [{
					label: '',
					data: Object.values( sortingCountriesByPopular( countriesArr )),
					backgroundColor: dynamicColors(),
					borderColor: '#ccc',
					
					borderWidth: 1
				}]
			},
			options: {
				maintainAspectRatio: false,
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
					backgroundColor: bgColorsBright,
					borderColor: '#eee',
					borderWidth: 1
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
					backgroundColor: bgColorsBright,
					borderColor: '#eee',
					borderWidth: 1
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
				datasets: [
					{
						label: 'Happy',
						backgroundColor: bgColors[0],
						borderColor: borderColors[0],
						fill: false,
						data: mapEmotions(happyData)
					},
					{
						label: 'Surprised',
						backgroundColor: bgColors[1],
						borderColor: borderColors[1],
						fill: false,
						data: mapEmotions(surprisedData)
					},
					{
						label: 'Sad',
						backgroundColor: bgColors[2],
						borderColor: borderColors[2],
						fill: false,
						data: mapEmotions(sadData)
					},
					{
						label: 'Disappointed',
						backgroundColor: bgColors[3],
						borderColor: borderColors[3],
						fill: false,
						data: mapEmotions(disappointedData)
					},
					{
						label: 'Afraid',
						backgroundColor: bgColors[4],
						borderColor: borderColors[4],
						fill: false,
						data: mapEmotions(afraidData)
					},
					{
						label: 'Angry',
						backgroundColor: bgColors[5],
						borderColor: borderColors[5],
						fill: false,
						data: mapEmotions(angryData)
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				title: {
					text: 'Time Scale'
				},
				scales: {
					xAxes: [{
						scaleLabel: {
							display: false,
							labelString: 'Date'
						}
					}],
					yAxes: [{
						scaleLabel: {
							display: true,
							labelString: 'value (%)'
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
			
			var itemExpId = item.emotions[0].experienceID;
			var itemExpIdRn = itemExpId;
			
			Object.keys(expIdRenamed).forEach(function(item, i, arr) {
				if ( item == itemExpId ) {
					//console.log(nameItem);
					itemExpIdRn = Object.values(expIdRenamed)[i];
				}
			});
			
			if ( ! expArr[ itemExpId ] ){
				expArr[ itemExpId ] = itemExpIdRn
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
				'<label class="form-check-label" for="expCheck_' + i + '">'+ Object.values(expArr)[i] +'</label>' +
				'</div>');
			
			$expContainer.append($expCheckbox);
		}
		
		// countries
		
		Object.keys( sortingCountries( countriesArr )).forEach(function (item, i, arr) {
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
	
	
	/*
	
	 functions
	 
	 */
	
	// filtering
	
	function startFiltering() {
		//console.log('start');
		activeFilters = true;
		clearObjects();
		
		showSelectedFilters();
		
		initChartArrays( dataObj );
		updateCharts();
	}
	
	// create average array for emotions
	
	function emotionsCreateArr(emotions) {
		var dataLength = arrLength;
		
		return $.map( emotions, function (item) {
			return (item/dataLength)*100
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
		
		for (let key in emotions){
			emotions[key] = 0
		}
		
		for (let key in happyData){
			happyData[key] = 0
		}
		
		for (let key in surprisedData){
			surprisedData[key] = 0
		}
		
		for (let key in sadData){
			sadData[key] = 0
		}
		
		for (let key in disappointedData){
			disappointedData[key] = 0
		}
		
		for (let key in afraidData){
			afraidData[key] = 0
		}
		
		for (let key in angryData){
			angryData[key] = 0
		}
		
	}
	
	// update charts
	
	function updateCharts() {
		genderChart.data.datasets[0].data = Object.values(genderData);
		ageChart.data.datasets[0].data = Object.values(ageData);
		emotionsChart.data.datasets[0].data = emotionsCreateArr(emotions);
		experienceChart.data.datasets[0].data = Object.values(expArr);
		countriesChart.data.datasets[0].data = Object.values( sortingCountriesByPopular( countriesArr ));
		countriesChart.data.labels = Object.keys( sortingCountriesByPopular( countriesArr ));
		
		// console.log(sortingCountriesByPopular( countriesArr ));
		// console.log(countriesArr);
		
		emotionsDatesChart.data.datasets[0].data = mapEmotions(happyData);
		
		//console.log(happyData);
		
		emotionsDatesChart.data.datasets[1].data = mapEmotions(surprisedData);
		emotionsDatesChart.data.datasets[2].data = mapEmotions(sadData);
		emotionsDatesChart.data.datasets[3].data = mapEmotions(disappointedData);
		emotionsDatesChart.data.datasets[4].data = mapEmotions(afraidData);
		emotionsDatesChart.data.datasets[5].data = mapEmotions(angryData);
		
		emotionsDatesChart.data.labels = Object.keys(happyData);
		
		//console.log(Object.keys(happyData));
		
		genderChart.update();
		ageChart.update();
		emotionsChart.update();
		experienceChart.update();
		countriesChart.update();
		
		emotionsDatesChart.update();
	}
	
	// for filters
	
	function checkVisibility(item) {
		// gender
		var genderVal = parseInt( $('.js-gender:checked').val() );
		//console.log(genderVal);
		var visibleG = item.demographics[0].gender == genderVal || genderVal == '-1';
		
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
		
		var minDate = dateToTimestamp( $('.slider-time').attr('data-value') );
		var maxDate = dateToTimestamp( $('.slider-time2').attr('data-value') );
		
		//console.log(minDate, ' ', maxDate);
		
		var visibleD = true;
		var itemDate = item.sessionData.timestamp;
		
		if ( minDate <= itemDate && itemDate <= maxDate ) {
			visibleD = true
		} else {
			visibleD = false;
		}
		
		var visible = visibleG && visibleA && visibleC && visibleExp && visibleD;
		
		return visible;
	}
	
	
	// selected filters
	
	function showSelectedFilters() {
		
		// containers for filters
		
		var $filtersAll = $('.js-selected-filters-all'),
			$filtersDates = $('.js-selected-filters-dates'),
			$filtersDatesBtn= $('.js-selected-filters-dates-btn'),
			$filtersGender = $('.js-selected-filters-gender'),
			$filtersExp = $('.js-selected-filters-exp'),
			$filtersCountry =  $('.js-selected-filters-country'),
			$filtersAge = $('.js-selected-filters-age');
		
		$filtersAll.empty().hide();
		$filtersDates.empty().hide();
		$filtersDatesBtn.empty().hide();
		$filtersGender.empty().hide();
		$filtersExp.empty().hide();
		$filtersCountry.empty().hide();
		$filtersAge.empty().hide();
		
		// filters values
		
		var $filterDate1 = $('.slider-time'),
			$filterDate2 = $('.slider-time2'),
			$filterBtnActive = $('.js-btn-date.active');
		
		$filtersAll.hide();
		
		// dates
		
		if ( $filterDate1.hasClass('active') || $filterDate2.hasClass('active')) {
			$filtersDates
				.show()
				.text('from ' + $filterDate1.text() + ' to ' + $filterDate2.text() + ', ')
		}
		
		if ( $filterBtnActive.length ) {
			$filtersDatesBtn.show().text($filterBtnActive.text() + ', ');
		}
		
		// Gender
		
		var $checkedGender = $('.js-gender:checked');
		
		if ( $checkedGender.length && $checkedGender.attr('value') != -1 ) {
			$filtersGender.show().text( $checkedGender.next('label').text() + ', ' );
		}
		
		// experience
		
		var $experience = $('.js-exp:checked');
		
		if ( $experience.length ) {
			$filtersExp.show();
			
			$experience.each(function () {
				var $self = $(this);
				$filtersExp.append( '<span>' + $self.next('label').text()  + ', </span>' )
			})
			
		}
		
		// country
		
		var $country = $('.js-country:checked');
		
		if ( $country.length ) {
			$filtersCountry.show();
			
			$country.each(function () {
				var $self = $(this);
				$filtersCountry.append( '<span>' + $self.next('label').text()  + ', </span>' )
			})
			
		}
		
		// age
		
		var $ageMin = $('.js-age-min');
		var $ageMax = $('.js-age-max');
		
		if ( $ageMin.val().length > 0 || $ageMax.val().length > 0) {
			$filtersCountry.show();
		}
		
		if ( $ageMin.val().length > 0 ) {
			$filtersAge.append( '<span>from&nbsp;' + $ageMin.val()  + 'yo,&nbsp;</span>' )
		} else if ($ageMax.val().length > 0) {
			$filtersAge.append( '<span>to&nbsp;' + $ageMax.val()  + 'yo,&nbsp;</span>' )
		}
		
	}
	
	// bert index
	
	function bert(arr) {
		var happy = arr[0],
			surprised = arr[1],
			sad = arr[2],
			dissapointed = arr[3],
			afraid = arr[4],
			angry = arr[5];
		
		var bert;
		var $bertVal = $('.bert-value');
		
		
		//console.log(arr);
		//console.log( (3*happy + surprised) - (sad + dissapointed + afraid + angry) );
		
		bert = bertFunc(happy, surprised, sad, dissapointed, afraid, angry);
		
		//console.log(bert, ' ', bert/100);
		
		$bertVal
			.css('bottom', bert*50 + '%')
			.text( bert );
	}
	
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
		// myDate=myDate.split("/");
		// var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2]+' '+myDate[3]+':'+myDate[4];
		//
		return new Date(myDate).getTime() / 1000;
	}
	
	// add zero to days and months
	
	function zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}
	
	// map emotions for emotions and days chart
	
	function mapEmotions(arr) {
		return $.map(arr, function (value, key) {
			var newItem = {
				'x' : key,
				'y' : value.valuesLength ? (value.values/value.valuesLength)*100 : 0
			};
			
			return newItem
		})
	}
	
	// sorting countries
	
	function sortingCountries(not_sorted) {
		return Object.keys(not_sorted)
			.sort()
			.reduce(function (acc, key) {
				acc[key] = not_sorted[key];
				return acc;
			}, {});
	}
	
	function sortingCountriesByPopular(not_sorted) {
		
		return Object.keys(not_sorted)
			.sort(function(a, b) {
				return not_sorted[b] - not_sorted[a]
			})
			.reduce(function (acc, key) {
				acc[key] = not_sorted[key];
				return acc;
			}, {});
		
	}
	
	
	
	
	/*
	
	 jquery ui slider for age
	 
	 */
	
	function formatDT(__dt) {
		var year = __dt.getFullYear();
		var month = zeroPad(__dt.getMonth()+1, 2);
		var date = zeroPad(__dt.getDate(), 2);
		
		return date + '/' + month + '/' + year;
	}
	
	function formatDTmins(__dt) {
		var year = __dt.getFullYear();
		var month = zeroPad(__dt.getMonth()+1, 2);
		var date = zeroPad(__dt.getDate(), 2);
		var hours = zeroPad(__dt.getHours(), 2);
		var minutes = zeroPad(__dt.getMinutes(), 2);
		var seconds = zeroPad(__dt.getSeconds(), 2);
		
		return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	}
	
	$( function() {
		
		var dt_from = new Date('2018/08/01');
		var dt_to = new Date();
		//dt_to.setDate((new Date()).getDate() + 1)
		
		$('.slider-time')
			.attr('data-value', formatDTmins(dt_from))
			.html(formatDT(dt_from));
		$('.slider-time2')
			.attr('data-value', formatDTmins(dt_to))
			.html(formatDT(dt_to));
		
		var min_val = Date.parse(dt_from)/1000;
		var max_val = Date.parse(dt_to)/1000;
		
		
		
		$("#slider-range").slider({
			range: true,
			min: min_val,
			max: max_val,
			step: 10,
			values: [min_val, max_val],
			change: function (e, ui) {
				var dt_cur_from = new Date(ui.values[0]*1000); //.format("yyyy-mm-dd hh:ii:ss");
				$('.slider-time')
					.attr('data-value', formatDTmins(dt_cur_from))
					.html(formatDT(dt_cur_from));
				
				var dt_cur_to = new Date(ui.values[1]*1000); //.format("yyyy-mm-dd hh:ii:ss");
				$('.slider-time2')
					.attr('data-value', formatDTmins(dt_cur_to))
					.html(formatDT(dt_cur_to));
				
				
				//console.log('change');
				$('#slider').trigger('slidechange');
				
				startFiltering();
			},
			stop: function (e, ui) {
				//startFiltering();
				// $('body').trigger('filteringDates');
				//console.log('stop');
			},
			start: function (e, ui) {
				//startFiltering();
				// $('body').trigger('filteringDates');
				//console.log('start ui');
			},
			slide: function (e, ui) {
				if ($('.js-btn-date.active').length) {
					$('.js-btn-date.active').removeClass('active');
					$('.slider-time').removeClass('active');
				} else {
					$('.slider-time').addClass('active');
				}
			}
		}).bind('slidechange',function(event,ui){
			//console.log('slidechange trigger');
			//startFiltering();
		});
		
	});
	
	// $("#slider-range").on('change', function () {
	// 	console.log('ui onchange');
	//
	// });
	
	// tooltip
	
	
	$('.tooltipster').tooltipster({
		trigger: 'custom',
		triggerOpen: {
			click: true,
			tap: true
		},
		triggerClose: {
			mouseleave: true,
			click: true,
			scroll: true,
			tap: true
		}
	});
	
	
	
	// filters css
	
	
	$('.js-toggle-filters').on('click', function () {
		var $filters = $('.filters');
		
		if ( $(this).hasClass('opened') ) {
			$(this).removeClass('opened').text('Show filters');
			$filters.hide();
		} else {
			$(this).addClass('opened').text('Hide filters');
			$filters.show();
		}
	})
	
	
});

