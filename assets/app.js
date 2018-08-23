$(document).ready(function () {
	
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
	
	var emotions = {
		"happy": 0,
		"surprised": 0,
		"sad": 0,
		"disappointed": 0,
		"afraid": 0,
		"neutro": 0,
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
		gender: 'visible',
		emotions: false,
		countries: false,
		age: false,
		expId: false,
		dates: false
	};
	
	
	// countries
	
	var countriesArr = {};
	
	// exp
	
	var expArr = {};
	
	// parse json
	
	$.getJSON( "data2.json", function( json ) {
		// http://18.218.159.157:8001/emotionsData
		dataObj = json;
	}).done(function() {
		initObj(dataObj);
		initChartArrays(dataObj);
		initCharts();
		initFilters(dataObj);
		// console.log(json);
	});
	
	
	// actions
	
	$('body').on('change', '.js-gender', function () {
		filters.gender = parseInt( $(this).val() );
		
		clearObjects();
		filterArr();
		initChartArrays( dataObj );
		
		console.log(genderChart.data.datasets[0].data);
		genderChart.data.datasets[0].data = Object.values(genderData);
		console.log(genderChart.data.datasets[0].data);
		genderChart.update();
		
	});
	
	// init functions
	
	function filterArr() {
		var filtersGender = parseFloat( filters.gender );
		
		genderSorted = $.map( dataObj, function(item) {
			var genderArrayVal = parseFloat( item.demographics[0].gender );
			
			// if ( filtersGender == genderArrayVal ){
			// 	item.hidden.gender = false
			// } else {
			// 	item.hidden.gender = true
			// }
			//
			
			
			switch (true) {
				case ( filtersGender === 1 ) : {
					if (genderArrayVal !== 1) {
						item.hidden.gender = 'hidden'
					} else {
						item.hidden.gender = 'visible'
					}
				}
					break;
				case ( filtersGender === 2 ) : {
					if (genderArrayVal !== 2) {
						item.hidden.gender = 'hidden'
					} else {
						item.hidden.gender = 'visible'
					}
				}
					break;
				case ( filtersGender === 0) : {
					if (genderArrayVal !== 0) {
						item.hidden.gender = 'hidden'
					} else {
						item.hidden.gender = 'visible'
					}
				}
					break;
				default : {
					item.hidden.gender = 'visible'
				}
				
			}
			
			//console.log(item.hidden.gender);
			
			return item.hidden.gender;
		})
	}
	
	
	// init data object (add filter keys
	
	function initObj(data) {
		data.forEach(function(item, i, arr) {
			item.hidden = filters;
		});
	}
	
	function clearObjects() {
		
		for (var key in genderData){
			genderData[key] = 0
		}
		
		
	}
	
	// init chart
	
	function initChartArrays(data) {
		//
		// var x = $.map( genderData, function (item) {
		// 	return item
		// });
		//
		// console.log(x);
		
		//console.log(data);
		// console.log(newDataObj[0].hidden.gender);
		//console.log(data);
		
		//console.log(data);
		
		data.forEach(function(item, i, arr) {
			
			//console.log(filters.gender);
			
			//console.log(genderSorted[i]);
			
			// gender
			
			//genderData.all = data.length;
			
			if (genderSorted[i] != 'hidden') {
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
				
				emotions.happy += item.emotions[0].happy;
				emotions.surprised += item.emotions[0].surprised;
				emotions.sad += item.emotions[0].sad;
				emotions.disappointed += item.emotions[0].disappointed;
				emotions.afraid += item.emotions[0].afraid;
				emotions.neutro += item.emotions[0].neutro;
				emotions.angry += item.emotions[0].angry;
				
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
			}
			
		});
		
		//console.log(genderData);
	}
	
	function emotionsCreateArr() {
		var dataLength = dataObj.length;
		
		return $.map( emotions, function (item) {
			return item/dataLength
		});
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
					data: emotionsCreateArr(),
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
				'<input class="form-check-input" type="checkbox" id="expCheck_' + i + '" value="exp_' + i + '">' +
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
				'<input class="form-check-input" type="checkbox" id="cCheck_' + i + '" value="c_' + i + '">' +
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
				'<input class="form-check-input" type="checkbox" id="emCheck_' + i + '" value="em_' + i + '">' +
				'<label class="form-check-label" for="emCheck_' + i + '">'+ el +'</label>' +
				'</div>');
			
			$emContainer.append($emCheckbox);
		}
	}
	
	
	/// jquery ui slider for age
	
	$( function() {
		// $( "#slider-range" ).slider({
		// 	range: true,
		// 	min: 0,
		// 	max: 500,
		// 	values: [ 75, 300 ],
		// 	slide: function( event, ui ) {
		// 		$( "#amount" ).val('From ' + ui.values[ 0 ] + " to " + ui.values[ 1 ] );
		// 	}
		// });
		// $( "#amount" ).val( "From " + $( "#slider-range" ).slider( "values", 0 ) +
		// 	" to " + $( "#slider-range" ).slider( "values", 1 ) );
		//
		
		
		var dt_from = "2014/11/01";
		var dt_to = "2014/11/24";
		
		$('.slider-time').html(dt_from);
		$('.slider-time2').html(dt_to);
		var min_val = Date.parse(dt_from)/1000;
		var max_val = Date.parse(dt_to)/1000;
		
		function zeroPad(num, places) {
			var zero = places - num.toString().length + 1;
			return Array(+(zero > 0 && zero)).join("0") + num;
		}
		function formatDT(__dt) {
			var year = __dt.getFullYear();
			var month = zeroPad(__dt.getMonth()+1, 2);
			var date = zeroPad(__dt.getDate(), 2);
			var hours = zeroPad(__dt.getHours(), 2);
			var minutes = zeroPad(__dt.getMinutes(), 2);
			var seconds = zeroPad(__dt.getSeconds(), 2);
			// return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
			
			return year + '-' + month + '-' + date;
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
			}
		});
		
	});
	
	
	// timestamp to date
	
	
	// date to timestamp
	
	
});