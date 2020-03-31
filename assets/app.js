$(document).ready(function () {

	var customTimestamp = 1549161741;
	let bertMinutesSortedObj = [];
	let sliderDataArr = [];

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

	var arrSorted = [];
	var arrLength = 0;

	var emotions = {
		"happy": 0,
		"surprised": 0,
		"sad": 0,
		"disappointed": 0,
		"afraid": 0,
		//"neutro": 0,
		"angry": 0
	};


	var dataObj = [];

	// exp

	var expArr = {};

	var happyData = {};
	var surprisedData = {};
	var sadData = {};
	var disappointedData = {};
	var afraidData = {};
	var angryData = {};

	/*
	
	 parse json
	 
	 */
	
	var $loginform = $("#loginform");
	var $guestform = $("#guest-form");
	
	$loginform.on('submit', function (e) {
		var event = e;
		var $form = $(this);
		
		submitHandler(event, $form);
		
		// setInterval(function(){
		// 	updatePage($form)
		// }, 60000)
	});
	
	$guestform.on('submit', function (e) {
		var event = e;
		var $form = $(this);
		
		submitHandler(event, $form);
		
		setInterval(function(){
			updatePage($form)
		}, 15000)
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

		var formData = $form.serializeArray();

		formData.push({name: 'timestamp', value: customTimestamp });
		
		$.ajax({
			type: 'POST',
			url: 'https://moodme.tk:8001/emotionsData',
			crossDomain: true,
			data: formData,
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				$('.login-modal').hide();
				
				if ( $('.chart-page').length ) {
					
					init(responseData);
					
					$('.preloader').hide();
					
				}
			},
			error: function (responseData, textStatus, errorThrown) {
				alert( "Wrong email or password. Try again" );
				$('.preloader').hide();
			}
		});
	}

	function init(responseData) {
		dataObj = responseData;
		arrSorted = responseData;
		reduceTimeBertCharts(responseData);
		initChartArrays(dataObj);
		initCharts();
		createSliderData(responseData);
		initSlider();
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

		var formData = $form.serializeArray();

		formData.push({name: 'timestamp', value: customTimestamp});
		
		$.ajax({
			type: 'POST',
			url: 'https://moodme.tk:8001/emotionsData',
			crossDomain: true,
			data: formData,
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				dataObj = responseData;
				arrSorted = responseData;
				reduceTimeBertCharts(responseData);
				initChartArrays(dataObj);
				initCharts();
				createSliderData(responseData, true);
				initSlider();
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
	
	guestSubmit();
	

	/*
	
	 actions
	 
	 */
	
	var $body = $('body');

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

			arrLength++;

			// emotions

			for (var em_key in emotions) {
				emotions[em_key] += item.emotions[0][em_key];
			}


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
			
		});
		
		bert(emotionsCreateArr(emotions));
	}
	
	// init charts
	
	function initCharts() {
		// emotions and dates
		
		var ctxED = document.getElementById("emotionsDatesChart").getContext('2d');
		emotionsDatesChart = new Chart(ctxED, {
			type: 'line',
			data: {
				labels: Object.keys(bertMinutesSortedObj),
				datasets: [
					{
						label: 'Bert',
						backgroundColor: bgColors[0],
						borderColor: borderColors[0],
						fill: false,
						data: Object.values(bertMinutesSortedObj)
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
							labelString: 'value'
						}
					}]
				},
			}
		});
	}

	/*
	
	 functions
	 
	 */
	
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

		
		emotionsDatesChart.data.datasets[0].data = mapEmotions(happyData);
		
		//console.log(happyData);
		
		emotionsDatesChart.data.datasets[1].data = mapEmotions(surprisedData);
		emotionsDatesChart.data.datasets[2].data = mapEmotions(sadData);
		emotionsDatesChart.data.datasets[3].data = mapEmotions(disappointedData);
		emotionsDatesChart.data.datasets[4].data = mapEmotions(afraidData);
		emotionsDatesChart.data.datasets[5].data = mapEmotions(angryData);
		
		emotionsDatesChart.data.labels = Object.keys(happyData);

		emotionsDatesChart.update();
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

		
		bert = bertFunc(happy, surprised, sad, dissapointed, afraid, angry);

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

	// timestamp to hour and minute

	function timestampToMinute(timestamp) {
		var newDate = new Date();

		newDate.setTime(timestamp*1000);

		var minute = newDate.getMinutes();
		var hour = newDate.getHours();
		// todo: delete this
		var month = zeroPad(newDate.getMonth()+1, 2);
		var date = zeroPad(newDate.getDate(), 2);

		return zeroPad(hour, 2) + ':' + zeroPad(minute, 2);
	}

	// reduce data to object { minute: emotion }

	function reduceTimeBertCharts(emotionsArray) {
		let reducedToMinute = [];
		const today = new Date();
		let startGraphicDate = new Date();
		startGraphicDate.setDate(today.getDate() - 1);

		emotionsArray.forEach(function(item) {
			const currentTimestamp = item.sessionData.timestamp;

			// TODO: make right comparing
			if (currentTimestamp < dateToTimestamp(startGraphicDate)) {
				return;
			}
			const emotions = item.emotions[0];
			const minute = timestampToMinute(currentTimestamp);
			if (reducedToMinute[minute] && reducedToMinute[minute].length) {
				reducedToMinute[minute].push(emotions)
			} else {
				reducedToMinute[minute] = [];
				reducedToMinute[minute].push(emotions);
			}
		});

		bertMinutesSortedObj = transformTimeBertData(reducedToMinute);
	}

	function transformTimeBertData(minuteAndArrays) {
		const keys = Object.keys(minuteAndArrays);
		let newMinuteAndArrays = minuteAndArrays;

		for (let minute of keys) {
			let minuteValues = {};
			let arrayOfArrays = minuteAndArrays[minute];
			minuteValues.currentLength = arrayOfArrays.length;

			arrayOfArrays.forEach(function(item, index) {
				for (let emotion in item) {
					const currentEmotion = item[emotion];
					if (minuteValues[emotion]) {
						minuteValues[emotion] += currentEmotion
					} else if (typeof currentEmotion === "number") {
						minuteValues[emotion] = currentEmotion
					}
				}
			});

			//console.log(transformedTimeEmotionsArray)
			newMinuteAndArrays[minute] = minuteValues;
		}

		for (let min in newMinuteAndArrays) {
			for (let emotionValue in newMinuteAndArrays[min]) {
				if (emotionValue !== 'currentLength' && emotionValue !== 'time') {
					newMinuteAndArrays[min][emotionValue] = newMinuteAndArrays[min][emotionValue]/newMinuteAndArrays[min].currentLength
				}
			}
		}

		for (let min in newMinuteAndArrays) {
			const { happy, surprised, sad, dissapointed, afraid, angry } = newMinuteAndArrays[min];
			newMinuteAndArrays[min] = bertFunc(happy, surprised, sad, 0, afraid, angry);
		}

		return newMinuteAndArrays
	}

	// date to timestamp
	
	function dateToTimestamp(newDate) {
		// myDate=myDate.split("/");
		// var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2]+' '+myDate[3]+':'+myDate[4];
		//
		return new Date(newDate).getTime() / 1000;
	}
	
	// map emotions for emotions and days chart
	
	function mapEmotions(arr) {
		return $.map(arr, function (value, key) {
			var newItem = {
				'x' : key,
				'y' : value.valuesLength ? (value.values/value.valuesLength) : 0
			};
			
			return newItem
		})
	}

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

	// add zero to days and months

	function zeroPad(num, places) {
		var zero = places - num.toString().length + 1;
		return Array(+(zero > 0 && zero)).join("0") + num;
	}

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

	// slick

	function createSliderData(data, isUpdate) {
		// console.log(data)
		sliderDataArr = data.slice(Math.max(data.length - 10, 0));
		const revsliderDataArr = sliderDataArr.reverse();
		const $lastActions = $('.js-last-actions');
		$lastActions.css('opacity', 0.2);

		if (isUpdate) {
			$lastActions.slick('unslick');
			$lastActions.empty();
		}

		revsliderDataArr.forEach(function (item) {
			$lastActions.append(createSliderEl(item));
		});

		setTimeout(function () {
			$lastActions.css('opacity', 1);
		}, 600);
	}

	function createSliderEl(itemData) {
		// console.log(itemData.emotions);
		const img = itemData.emotions[0].experienceID;
		const age = mapAge(itemData.demographics[0].age);
		const country = mapFlag(itemData.sessionData.country);
		const gender = mapGender(itemData.demographics[0].gender);
		const emotion = mapEmotionsArr(itemData.emotions[0]);
		const element = $('<div class="last-action">' +
			'                <div class="last-action-inner">' +
			'                    <div class="last-action__header">' +
			'                        <div class="last-action__header-emotion">' +
			emotion +
			'                        </div>' +
			'                        <div class="last-action__header-gender">' +
			gender +
			'                        </div>' +
			'                        <div class="last-action__header-age">' +
			age +
			'                        </div>' +
			'                    </div>' +
			'                    <div class="last-action__mask">' +
			'                        <img src="images/' + img +'/icon.png" alt="">' +
			'                    </div>' +
			'                    <div class="last-action__flag">' +
			country +
			'                    </div>' +
			'                </div>' +
			'            </div>');

		return element;
	}

	function initSlider() {
		var $lastActions = $('.js-last-actions');
		if ($lastActions.length) {
			$lastActions.slick({
				centerMode: true,
				centerPadding: '10px',
				slidesToShow: 3,
				infinite: false
			});
		}
	}

	function mapGender(val) {
		switch (val) {
			case 2: return '👩';
			case 1: return '👨';
			default: return ''
		}
	}

	function mapFlag(val) {
		const country = flags.find(function (item) {
			return item.code == val
		});

		return country.emoji;
	}

    function mapAge(val) {
        switch (true) {
            case val < 10: return '0-10';
            case val >= 10 && val < 20: return '10-20';
            case val >= 20 && val < 25: return '20-25';
            case val >= 25 && val < 35: return '25-35';
            case val >= 35 && val < 45: return '35-45';
            case val >= 45 && val < 55: return '45-55';
            case val >= 55 && val < 65: return '55-65';
            case val >= 65 : return '>65';
            default: return ''
        }
    }

	function mapEmotionsArr(arr) {
		switch (true) {
			case (arr.happy > arr.surprised && arr.happy > arr.sad && arr.happy > arr.disappointed && arr.happy > arr.afraid && arr.happy > arr.neutro && arr.happy > arr.angry)
			: return '😊';
			case (arr.surprised > arr.happy && arr.surprised > arr.sad && arr.surprised > arr.disappointed && arr.surprised > arr.afraid && arr.surprised > arr.neutro && arr.surprised > arr.angry)
			: return '😮';
			case (arr.sad > arr.happy && arr.sad > arr.surprised && arr.sad > arr.disappointed && arr.sad > arr.afraid && arr.sad > arr.neutro && arr.sad > arr.angry)
			: return '😔';
			case (arr.disappointed > arr.happy && arr.disappointed > arr.surprised && arr.disappointed > arr.sad && arr.disappointed > arr.afraid && arr.disappointed > arr.neutro && arr.disappointed > arr.angry)
			: return '😟';
			case (arr.afraid > arr.happy && arr.afraid > arr.surprised && arr.afraid > arr.sad && arr.afraid > arr.disappointed && arr.afraid > arr.neutro && arr.afraid > arr.angry)
			: return '😨';
			case (arr.neutro > arr.happy && arr.neutro > arr.surprised && arr.neutro > arr.sad && arr.neutro > arr.disappointed && arr.neutro > arr.afraid && arr.neutro > arr.angry)
			: return '😐';
			case (arr.angry > arr.happy && arr.angry > arr.surprised && arr.angry > arr.sad && arr.angry > arr.disappointed && arr.angry > arr.afraid && arr.angry > arr.neutro)
			: return '😠';
			default: return ''
		}
	}
});

const flags = [
	{
		"code": "AD",
		"emoji": "🇦🇩",
		"unicode": "U+1F1E6 U+1F1E9",
		"name": "Andorra",
		"title": "flag for Andorra",
		"dialCode": "+376"
	},
	{
		"code": "AE",
		"emoji": "🇦🇪",
		"unicode": "U+1F1E6 U+1F1EA",
		"name": "United Arab Emirates",
		"title": "flag for United Arab Emirates",
		"dialCode": "+971"
	},
	{
		"code": "AF",
		"emoji": "🇦🇫",
		"unicode": "U+1F1E6 U+1F1EB",
		"name": "Afghanistan",
		"title": "flag for Afghanistan",
		"dialCode": "+93"
	},
	{
		"code": "AG",
		"emoji": "🇦🇬",
		"unicode": "U+1F1E6 U+1F1EC",
		"name": "Antigua and Barbuda",
		"title": "flag for Antigua and Barbuda",
		"dialCode": "+1268"
	},
	{
		"code": "AI",
		"emoji": "🇦🇮",
		"unicode": "U+1F1E6 U+1F1EE",
		"name": "Anguilla",
		"title": "flag for Anguilla",
		"dialCode": "+1 264"
	},
	{
		"code": "AL",
		"emoji": "🇦🇱",
		"unicode": "U+1F1E6 U+1F1F1",
		"name": "Albania",
		"title": "flag for Albania",
		"dialCode": "+355"
	},
	{
		"code": "AM",
		"emoji": "🇦🇲",
		"unicode": "U+1F1E6 U+1F1F2",
		"name": "Armenia",
		"title": "flag for Armenia",
		"dialCode": "+374"
	},
	{
		"code": "AO",
		"emoji": "🇦🇴",
		"unicode": "U+1F1E6 U+1F1F4",
		"name": "Angola",
		"title": "flag for Angola",
		"dialCode": "+244"
	},
	{
		"code": "AQ",
		"emoji": "🇦🇶",
		"unicode": "U+1F1E6 U+1F1F6",
		"name": "Antarctica",
		"title": "flag for Antarctica",
		"dialCode": null
	},
	{
		"code": "AR",
		"emoji": "🇦🇷",
		"unicode": "U+1F1E6 U+1F1F7",
		"name": "Argentina",
		"title": "flag for Argentina",
		"dialCode": "+54"
	},
	{
		"code": "AS",
		"emoji": "🇦🇸",
		"unicode": "U+1F1E6 U+1F1F8",
		"name": "American Samoa",
		"title": "flag for American Samoa",
		"dialCode": "+1 684"
	},
	{
		"code": "AT",
		"emoji": "🇦🇹",
		"unicode": "U+1F1E6 U+1F1F9",
		"name": "Austria",
		"title": "flag for Austria",
		"dialCode": "+43"
	},
	{
		"code": "AU",
		"emoji": "🇦🇺",
		"unicode": "U+1F1E6 U+1F1FA",
		"name": "Australia",
		"title": "flag for Australia",
		"dialCode": "+61"
	},
	{
		"code": "AW",
		"emoji": "🇦🇼",
		"unicode": "U+1F1E6 U+1F1FC",
		"name": "Aruba",
		"title": "flag for Aruba",
		"dialCode": "+297"
	},
	{
		"code": "AX",
		"emoji": "🇦🇽",
		"unicode": "U+1F1E6 U+1F1FD",
		"name": "Åland Islands",
		"title": "flag for Åland Islands",
		"dialCode": ""
	},
	{
		"code": "AZ",
		"emoji": "🇦🇿",
		"unicode": "U+1F1E6 U+1F1FF",
		"name": "Azerbaijan",
		"title": "flag for Azerbaijan",
		"dialCode": "+994"
	},
	{
		"code": "BA",
		"emoji": "🇧🇦",
		"unicode": "U+1F1E7 U+1F1E6",
		"name": "Bosnia and Herzegovina",
		"title": "flag for Bosnia and Herzegovina",
		"dialCode": "+387"
	},
	{
		"code": "BB",
		"emoji": "🇧🇧",
		"unicode": "U+1F1E7 U+1F1E7",
		"name": "Barbados",
		"title": "flag for Barbados",
		"dialCode": "+1 246"
	},
	{
		"code": "BD",
		"emoji": "🇧🇩",
		"unicode": "U+1F1E7 U+1F1E9",
		"name": "Bangladesh",
		"title": "flag for Bangladesh",
		"dialCode": "+880"
	},
	{
		"code": "BE",
		"emoji": "🇧🇪",
		"unicode": "U+1F1E7 U+1F1EA",
		"name": "Belgium",
		"title": "flag for Belgium",
		"dialCode": "+32"
	},
	{
		"code": "BF",
		"emoji": "🇧🇫",
		"unicode": "U+1F1E7 U+1F1EB",
		"name": "Burkina Faso",
		"title": "flag for Burkina Faso",
		"dialCode": "+226"
	},
	{
		"code": "BG",
		"emoji": "🇧🇬",
		"unicode": "U+1F1E7 U+1F1EC",
		"name": "Bulgaria",
		"title": "flag for Bulgaria",
		"dialCode": "+359"
	},
	{
		"code": "BH",
		"emoji": "🇧🇭",
		"unicode": "U+1F1E7 U+1F1ED",
		"name": "Bahrain",
		"title": "flag for Bahrain",
		"dialCode": "+973"
	},
	{
		"code": "BI",
		"emoji": "🇧🇮",
		"unicode": "U+1F1E7 U+1F1EE",
		"name": "Burundi",
		"title": "flag for Burundi",
		"dialCode": "+257"
	},
	{
		"code": "BJ",
		"emoji": "🇧🇯",
		"unicode": "U+1F1E7 U+1F1EF",
		"name": "Benin",
		"title": "flag for Benin",
		"dialCode": "+229"
	},
	{
		"code": "BL",
		"emoji": "🇧🇱",
		"unicode": "U+1F1E7 U+1F1F1",
		"name": "Saint Barthélemy",
		"title": "flag for Saint Barthélemy",
		"dialCode": "+590"
	},
	{
		"code": "BM",
		"emoji": "🇧🇲",
		"unicode": "U+1F1E7 U+1F1F2",
		"name": "Bermuda",
		"title": "flag for Bermuda",
		"dialCode": "+1 441"
	},
	{
		"code": "BN",
		"emoji": "🇧🇳",
		"unicode": "U+1F1E7 U+1F1F3",
		"name": "Brunei Darussalam",
		"title": "flag for Brunei Darussalam",
		"dialCode": "+673"
	},
	{
		"code": "BO",
		"emoji": "🇧🇴",
		"unicode": "U+1F1E7 U+1F1F4",
		"name": "Bolivia",
		"title": "flag for Bolivia",
		"dialCode": "+591"
	},
	{
		"code": "BQ",
		"emoji": "🇧🇶",
		"unicode": "U+1F1E7 U+1F1F6",
		"name": "Bonaire, Sint Eustatius and Saba",
		"title": "flag for Bonaire, Sint Eustatius and Saba"
	},
	{
		"code": "BR",
		"emoji": "🇧🇷",
		"unicode": "U+1F1E7 U+1F1F7",
		"name": "Brazil",
		"title": "flag for Brazil",
		"dialCode": "+55"
	},
	{
		"code": "BS",
		"emoji": "🇧🇸",
		"unicode": "U+1F1E7 U+1F1F8",
		"name": "Bahamas",
		"title": "flag for Bahamas",
		"dialCode": "+1 242"
	},
	{
		"code": "BT",
		"emoji": "🇧🇹",
		"unicode": "U+1F1E7 U+1F1F9",
		"name": "Bhutan",
		"title": "flag for Bhutan",
		"dialCode": "+975"
	},
	{
		"code": "BV",
		"emoji": "🇧🇻",
		"unicode": "U+1F1E7 U+1F1FB",
		"name": "Bouvet Island",
		"title": "flag for Bouvet Island"
	},
	{
		"code": "BW",
		"emoji": "🇧🇼",
		"unicode": "U+1F1E7 U+1F1FC",
		"name": "Botswana",
		"title": "flag for Botswana",
		"dialCode": "+267"
	},
	{
		"code": "BY",
		"emoji": "🇧🇾",
		"unicode": "U+1F1E7 U+1F1FE",
		"name": "Belarus",
		"title": "flag for Belarus",
		"dialCode": "+375"
	},
	{
		"code": "BZ",
		"emoji": "🇧🇿",
		"unicode": "U+1F1E7 U+1F1FF",
		"name": "Belize",
		"title": "flag for Belize",
		"dialCode": "+501"
	},
	{
		"code": "CA",
		"emoji": "🇨🇦",
		"unicode": "U+1F1E8 U+1F1E6",
		"name": "Canada",
		"title": "flag for Canada",
		"dialCode": "+1"
	},
	{
		"code": "CC",
		"emoji": "🇨🇨",
		"unicode": "U+1F1E8 U+1F1E8",
		"name": "Cocos (Keeling) Islands",
		"title": "flag for Cocos (Keeling) Islands",
		"dialCode": "+61"
	},
	{
		"code": "CD",
		"emoji": "🇨🇩",
		"unicode": "U+1F1E8 U+1F1E9",
		"name": "Congo",
		"title": "flag for Congo",
		"dialCode": "+243"
	},
	{
		"code": "CF",
		"emoji": "🇨🇫",
		"unicode": "U+1F1E8 U+1F1EB",
		"name": "Central African Republic",
		"title": "flag for Central African Republic",
		"dialCode": "+236"
	},
	{
		"code": "CG",
		"emoji": "🇨🇬",
		"unicode": "U+1F1E8 U+1F1EC",
		"name": "Congo",
		"title": "flag for Congo",
		"dialCode": "+242"
	},
	{
		"code": "CH",
		"emoji": "🇨🇭",
		"unicode": "U+1F1E8 U+1F1ED",
		"name": "Switzerland",
		"title": "flag for Switzerland",
		"dialCode": "+41"
	},
	{
		"code": "CI",
		"emoji": "🇨🇮",
		"unicode": "U+1F1E8 U+1F1EE",
		"name": "Côte D'Ivoire",
		"title": "flag for Côte D'Ivoire",
		"dialCode": "+225"
	},
	{
		"code": "CK",
		"emoji": "🇨🇰",
		"unicode": "U+1F1E8 U+1F1F0",
		"name": "Cook Islands",
		"title": "flag for Cook Islands",
		"dialCode": "+682"
	},
	{
		"code": "CL",
		"emoji": "🇨🇱",
		"unicode": "U+1F1E8 U+1F1F1",
		"name": "Chile",
		"title": "flag for Chile",
		"dialCode": "+56"
	},
	{
		"code": "CM",
		"emoji": "🇨🇲",
		"unicode": "U+1F1E8 U+1F1F2",
		"name": "Cameroon",
		"title": "flag for Cameroon",
		"dialCode": "+237"
	},
	{
		"code": "CN",
		"emoji": "🇨🇳",
		"unicode": "U+1F1E8 U+1F1F3",
		"name": "China",
		"title": "flag for China",
		"dialCode": "+86"
	},
	{
		"code": "CO",
		"emoji": "🇨🇴",
		"unicode": "U+1F1E8 U+1F1F4",
		"name": "Colombia",
		"title": "flag for Colombia",
		"dialCode": "+57"
	},
	{
		"code": "CR",
		"emoji": "🇨🇷",
		"unicode": "U+1F1E8 U+1F1F7",
		"name": "Costa Rica",
		"title": "flag for Costa Rica",
		"dialCode": "+506"
	},
	{
		"code": "CU",
		"emoji": "🇨🇺",
		"unicode": "U+1F1E8 U+1F1FA",
		"name": "Cuba",
		"title": "flag for Cuba",
		"dialCode": "+53"
	},
	{
		"code": "CV",
		"emoji": "🇨🇻",
		"unicode": "U+1F1E8 U+1F1FB",
		"name": "Cape Verde",
		"title": "flag for Cape Verde",
		"dialCode": "+238"
	},
	{
		"code": "CW",
		"emoji": "🇨🇼",
		"unicode": "U+1F1E8 U+1F1FC",
		"name": "Curaçao",
		"title": "flag for Curaçao"
	},
	{
		"code": "CX",
		"emoji": "🇨🇽",
		"unicode": "U+1F1E8 U+1F1FD",
		"name": "Christmas Island",
		"title": "flag for Christmas Island",
		"dialCode": "+61"
	},
	{
		"code": "CY",
		"emoji": "🇨🇾",
		"unicode": "U+1F1E8 U+1F1FE",
		"name": "Cyprus",
		"title": "flag for Cyprus",
		"dialCode": "+537"
	},
	{
		"code": "CZ",
		"emoji": "🇨🇿",
		"unicode": "U+1F1E8 U+1F1FF",
		"name": "Czech Republic",
		"title": "flag for Czech Republic",
		"dialCode": "+420"
	},
	{
		"code": "DE",
		"emoji": "🇩🇪",
		"unicode": "U+1F1E9 U+1F1EA",
		"name": "Germany",
		"title": "flag for Germany",
		"dialCode": "+49"
	},
	{
		"code": "DJ",
		"emoji": "🇩🇯",
		"unicode": "U+1F1E9 U+1F1EF",
		"name": "Djibouti",
		"title": "flag for Djibouti",
		"dialCode": "+253"
	},
	{
		"code": "DK",
		"emoji": "🇩🇰",
		"unicode": "U+1F1E9 U+1F1F0",
		"name": "Denmark",
		"title": "flag for Denmark",
		"dialCode": "+45"
	},
	{
		"code": "DM",
		"emoji": "🇩🇲",
		"unicode": "U+1F1E9 U+1F1F2",
		"name": "Dominica",
		"title": "flag for Dominica",
		"dialCode": "+1 767"
	},
	{
		"code": "DO",
		"emoji": "🇩🇴",
		"unicode": "U+1F1E9 U+1F1F4",
		"name": "Dominican Republic",
		"title": "flag for Dominican Republic",
		"dialCode": "+1 849"
	},
	{
		"code": "DZ",
		"emoji": "🇩🇿",
		"unicode": "U+1F1E9 U+1F1FF",
		"name": "Algeria",
		"title": "flag for Algeria",
		"dialCode": "+213"
	},
	{
		"code": "EC",
		"emoji": "🇪🇨",
		"unicode": "U+1F1EA U+1F1E8",
		"name": "Ecuador",
		"title": "flag for Ecuador",
		"dialCode": "+593"
	},
	{
		"code": "EE",
		"emoji": "🇪🇪",
		"unicode": "U+1F1EA U+1F1EA",
		"name": "Estonia",
		"title": "flag for Estonia",
		"dialCode": "+372"
	},
	{
		"code": "EG",
		"emoji": "🇪🇬",
		"unicode": "U+1F1EA U+1F1EC",
		"name": "Egypt",
		"title": "flag for Egypt",
		"dialCode": "+20"
	},
	{
		"code": "EH",
		"emoji": "🇪🇭",
		"unicode": "U+1F1EA U+1F1ED",
		"name": "Western Sahara",
		"title": "flag for Western Sahara"
	},
	{
		"code": "ER",
		"emoji": "🇪🇷",
		"unicode": "U+1F1EA U+1F1F7",
		"name": "Eritrea",
		"title": "flag for Eritrea",
		"dialCode": "+291"
	},
	{
		"code": "ES",
		"emoji": "🇪🇸",
		"unicode": "U+1F1EA U+1F1F8",
		"name": "Spain",
		"title": "flag for Spain",
		"dialCode": "+34"
	},
	{
		"code": "ET",
		"emoji": "🇪🇹",
		"unicode": "U+1F1EA U+1F1F9",
		"name": "Ethiopia",
		"title": "flag for Ethiopia",
		"dialCode": "+251"
	},
	{
		"code": "EU",
		"emoji": "🇪🇺",
		"unicode": "U+1F1EA U+1F1FA",
		"name": "European Union",
		"title": "flag for European Union"
	},
	{
		"code": "FI",
		"emoji": "🇫🇮",
		"unicode": "U+1F1EB U+1F1EE",
		"name": "Finland",
		"title": "flag for Finland",
		"dialCode": "+358"
	},
	{
		"code": "FJ",
		"emoji": "🇫🇯",
		"unicode": "U+1F1EB U+1F1EF",
		"name": "Fiji",
		"title": "flag for Fiji",
		"dialCode": "+679"
	},
	{
		"code": "FK",
		"emoji": "🇫🇰",
		"unicode": "U+1F1EB U+1F1F0",
		"name": "Falkland Islands (Malvinas)",
		"title": "flag for Falkland Islands (Malvinas)",
		"dialCode": "+500"
	},
	{
		"code": "FM",
		"emoji": "🇫🇲",
		"unicode": "U+1F1EB U+1F1F2",
		"name": "Micronesia",
		"title": "flag for Micronesia",
		"dialCode": "+691"
	},
	{
		"code": "FO",
		"emoji": "🇫🇴",
		"unicode": "U+1F1EB U+1F1F4",
		"name": "Faroe Islands",
		"title": "flag for Faroe Islands",
		"dialCode": "+298"
	},
	{
		"code": "FR",
		"emoji": "🇫🇷",
		"unicode": "U+1F1EB U+1F1F7",
		"name": "France",
		"title": "flag for France",
		"dialCode": "+33"
	},
	{
		"code": "GA",
		"emoji": "🇬🇦",
		"unicode": "U+1F1EC U+1F1E6",
		"name": "Gabon",
		"title": "flag for Gabon",
		"dialCode": "+241"
	},
	{
		"code": "GB",
		"emoji": "🇬🇧",
		"unicode": "U+1F1EC U+1F1E7",
		"name": "United Kingdom",
		"title": "flag for United Kingdom",
		"dialCode": "+44"
	},
	{
		"code": "GD",
		"emoji": "🇬🇩",
		"unicode": "U+1F1EC U+1F1E9",
		"name": "Grenada",
		"title": "flag for Grenada",
		"dialCode": "+1 473"
	},
	{
		"code": "GE",
		"emoji": "🇬🇪",
		"unicode": "U+1F1EC U+1F1EA",
		"name": "Georgia",
		"title": "flag for Georgia",
		"dialCode": "+995"
	},
	{
		"code": "GF",
		"emoji": "🇬🇫",
		"unicode": "U+1F1EC U+1F1EB",
		"name": "French Guiana",
		"title": "flag for French Guiana",
		"dialCode": "+594"
	},
	{
		"code": "GG",
		"emoji": "🇬🇬",
		"unicode": "U+1F1EC U+1F1EC",
		"name": "Guernsey",
		"title": "flag for Guernsey",
		"dialCode": "+44"
	},
	{
		"code": "GH",
		"emoji": "🇬🇭",
		"unicode": "U+1F1EC U+1F1ED",
		"name": "Ghana",
		"title": "flag for Ghana",
		"dialCode": "+233"
	},
	{
		"code": "GI",
		"emoji": "🇬🇮",
		"unicode": "U+1F1EC U+1F1EE",
		"name": "Gibraltar",
		"title": "flag for Gibraltar",
		"dialCode": "+350"
	},
	{
		"code": "GL",
		"emoji": "🇬🇱",
		"unicode": "U+1F1EC U+1F1F1",
		"name": "Greenland",
		"title": "flag for Greenland",
		"dialCode": "+299"
	},
	{
		"code": "GM",
		"emoji": "🇬🇲",
		"unicode": "U+1F1EC U+1F1F2",
		"name": "Gambia",
		"title": "flag for Gambia",
		"dialCode": "+220"
	},
	{
		"code": "GN",
		"emoji": "🇬🇳",
		"unicode": "U+1F1EC U+1F1F3",
		"name": "Guinea",
		"title": "flag for Guinea",
		"dialCode": "+224"
	},
	{
		"code": "GP",
		"emoji": "🇬🇵",
		"unicode": "U+1F1EC U+1F1F5",
		"name": "Guadeloupe",
		"title": "flag for Guadeloupe",
		"dialCode": "+590"
	},
	{
		"code": "GQ",
		"emoji": "🇬🇶",
		"unicode": "U+1F1EC U+1F1F6",
		"name": "Equatorial Guinea",
		"title": "flag for Equatorial Guinea",
		"dialCode": "+240"
	},
	{
		"code": "GR",
		"emoji": "🇬🇷",
		"unicode": "U+1F1EC U+1F1F7",
		"name": "Greece",
		"title": "flag for Greece",
		"dialCode": "+30"
	},
	{
		"code": "GS",
		"emoji": "🇬🇸",
		"unicode": "U+1F1EC U+1F1F8",
		"name": "South Georgia",
		"title": "flag for South Georgia",
		"dialCode": "+500"
	},
	{
		"code": "GT",
		"emoji": "🇬🇹",
		"unicode": "U+1F1EC U+1F1F9",
		"name": "Guatemala",
		"title": "flag for Guatemala",
		"dialCode": "+502"
	},
	{
		"code": "GU",
		"emoji": "🇬🇺",
		"unicode": "U+1F1EC U+1F1FA",
		"name": "Guam",
		"title": "flag for Guam",
		"dialCode": "+1 671"
	},
	{
		"code": "GW",
		"emoji": "🇬🇼",
		"unicode": "U+1F1EC U+1F1FC",
		"name": "Guinea-Bissau",
		"title": "flag for Guinea-Bissau",
		"dialCode": "+245"
	},
	{
		"code": "GY",
		"emoji": "🇬🇾",
		"unicode": "U+1F1EC U+1F1FE",
		"name": "Guyana",
		"title": "flag for Guyana",
		"dialCode": "+595"
	},
	{
		"code": "HK",
		"emoji": "🇭🇰",
		"unicode": "U+1F1ED U+1F1F0",
		"name": "Hong Kong",
		"title": "flag for Hong Kong",
		"dialCode": "+852"
	},
	{
		"code": "HM",
		"emoji": "🇭🇲",
		"unicode": "U+1F1ED U+1F1F2",
		"name": "Heard Island and Mcdonald Islands",
		"title": "flag for Heard Island and Mcdonald Islands"
	},
	{
		"code": "HN",
		"emoji": "🇭🇳",
		"unicode": "U+1F1ED U+1F1F3",
		"name": "Honduras",
		"title": "flag for Honduras",
		"dialCode": "+504"
	},
	{
		"code": "HR",
		"emoji": "🇭🇷",
		"unicode": "U+1F1ED U+1F1F7",
		"name": "Croatia",
		"title": "flag for Croatia",
		"dialCode": "+385"
	},
	{
		"code": "HT",
		"emoji": "🇭🇹",
		"unicode": "U+1F1ED U+1F1F9",
		"name": "Haiti",
		"title": "flag for Haiti",
		"dialCode": "+509"
	},
	{
		"code": "HU",
		"emoji": "🇭🇺",
		"unicode": "U+1F1ED U+1F1FA",
		"name": "Hungary",
		"title": "flag for Hungary",
		"dialCode": "+36"
	},
	{
		"code": "ID",
		"emoji": "🇮🇩",
		"unicode": "U+1F1EE U+1F1E9",
		"name": "Indonesia",
		"title": "flag for Indonesia",
		"dialCode": "+62"
	},
	{
		"code": "IE",
		"emoji": "🇮🇪",
		"unicode": "U+1F1EE U+1F1EA",
		"name": "Ireland",
		"title": "flag for Ireland",
		"dialCode": "+353"
	},
	{
		"code": "IL",
		"emoji": "🇮🇱",
		"unicode": "U+1F1EE U+1F1F1",
		"name": "Israel",
		"title": "flag for Israel",
		"dialCode": "+972"
	},
	{
		"code": "IM",
		"emoji": "🇮🇲",
		"unicode": "U+1F1EE U+1F1F2",
		"name": "Isle of Man",
		"title": "flag for Isle of Man",
		"dialCode": "+44"
	},
	{
		"code": "IN",
		"emoji": "🇮🇳",
		"unicode": "U+1F1EE U+1F1F3",
		"name": "India",
		"title": "flag for India",
		"dialCode": "+91"
	},
	{
		"code": "IO",
		"emoji": "🇮🇴",
		"unicode": "U+1F1EE U+1F1F4",
		"name": "British Indian Ocean Territory",
		"title": "flag for British Indian Ocean Territory",
		"dialCode": "+246"
	},
	{
		"code": "IQ",
		"emoji": "🇮🇶",
		"unicode": "U+1F1EE U+1F1F6",
		"name": "Iraq",
		"title": "flag for Iraq",
		"dialCode": "+964"
	},
	{
		"code": "IR",
		"emoji": "🇮🇷",
		"unicode": "U+1F1EE U+1F1F7",
		"name": "Iran",
		"title": "flag for Iran",
		"dialCode": "+98"
	},
	{
		"code": "IS",
		"emoji": "🇮🇸",
		"unicode": "U+1F1EE U+1F1F8",
		"name": "Iceland",
		"title": "flag for Iceland",
		"dialCode": "+354"
	},
	{
		"code": "IT",
		"emoji": "🇮🇹",
		"unicode": "U+1F1EE U+1F1F9",
		"name": "Italy",
		"title": "flag for Italy",
		"dialCode": "+39"
	},
	{
		"code": "JE",
		"emoji": "🇯🇪",
		"unicode": "U+1F1EF U+1F1EA",
		"name": "Jersey",
		"title": "flag for Jersey",
		"dialCode": "+44"
	},
	{
		"code": "JM",
		"emoji": "🇯🇲",
		"unicode": "U+1F1EF U+1F1F2",
		"name": "Jamaica",
		"title": "flag for Jamaica",
		"dialCode": "+1 876"
	},
	{
		"code": "JO",
		"emoji": "🇯🇴",
		"unicode": "U+1F1EF U+1F1F4",
		"name": "Jordan",
		"title": "flag for Jordan",
		"dialCode": "+962"
	},
	{
		"code": "JP",
		"emoji": "🇯🇵",
		"unicode": "U+1F1EF U+1F1F5",
		"name": "Japan",
		"title": "flag for Japan",
		"dialCode": "+81"
	},
	{
		"code": "KE",
		"emoji": "🇰🇪",
		"unicode": "U+1F1F0 U+1F1EA",
		"name": "Kenya",
		"title": "flag for Kenya",
		"dialCode": "+254"
	},
	{
		"code": "KG",
		"emoji": "🇰🇬",
		"unicode": "U+1F1F0 U+1F1EC",
		"name": "Kyrgyzstan",
		"title": "flag for Kyrgyzstan",
		"dialCode": "+996"
	},
	{
		"code": "KH",
		"emoji": "🇰🇭",
		"unicode": "U+1F1F0 U+1F1ED",
		"name": "Cambodia",
		"title": "flag for Cambodia",
		"dialCode": "+855"
	},
	{
		"code": "KI",
		"emoji": "🇰🇮",
		"unicode": "U+1F1F0 U+1F1EE",
		"name": "Kiribati",
		"title": "flag for Kiribati",
		"dialCode": "+686"
	},
	{
		"code": "KM",
		"emoji": "🇰🇲",
		"unicode": "U+1F1F0 U+1F1F2",
		"name": "Comoros",
		"title": "flag for Comoros",
		"dialCode": "+269"
	},
	{
		"code": "KN",
		"emoji": "🇰🇳",
		"unicode": "U+1F1F0 U+1F1F3",
		"name": "Saint Kitts and Nevis",
		"title": "flag for Saint Kitts and Nevis",
		"dialCode": "+1 869"
	},
	{
		"code": "KP",
		"emoji": "🇰🇵",
		"unicode": "U+1F1F0 U+1F1F5",
		"name": "North Korea",
		"title": "flag for North Korea",
		"dialCode": "+850"
	},
	{
		"code": "KR",
		"emoji": "🇰🇷",
		"unicode": "U+1F1F0 U+1F1F7",
		"name": "South Korea",
		"title": "flag for South Korea",
		"dialCode": "+82"
	},
	{
		"code": "KW",
		"emoji": "🇰🇼",
		"unicode": "U+1F1F0 U+1F1FC",
		"name": "Kuwait",
		"title": "flag for Kuwait",
		"dialCode": "+965"
	},
	{
		"code": "KY",
		"emoji": "🇰🇾",
		"unicode": "U+1F1F0 U+1F1FE",
		"name": "Cayman Islands",
		"title": "flag for Cayman Islands",
		"dialCode": "+ 345"
	},
	{
		"code": "KZ",
		"emoji": "🇰🇿",
		"unicode": "U+1F1F0 U+1F1FF",
		"name": "Kazakhstan",
		"title": "flag for Kazakhstan",
		"dialCode": "+7 7"
	},
	{
		"code": "LA",
		"emoji": "🇱🇦",
		"unicode": "U+1F1F1 U+1F1E6",
		"name": "Lao People's Democratic Republic",
		"title": "flag for Lao People's Democratic Republic",
		"dialCode": "+856"
	},
	{
		"code": "LB",
		"emoji": "🇱🇧",
		"unicode": "U+1F1F1 U+1F1E7",
		"name": "Lebanon",
		"title": "flag for Lebanon",
		"dialCode": "+961"
	},
	{
		"code": "LC",
		"emoji": "🇱🇨",
		"unicode": "U+1F1F1 U+1F1E8",
		"name": "Saint Lucia",
		"title": "flag for Saint Lucia",
		"dialCode": "+1 758"
	},
	{
		"code": "LI",
		"emoji": "🇱🇮",
		"unicode": "U+1F1F1 U+1F1EE",
		"name": "Liechtenstein",
		"title": "flag for Liechtenstein",
		"dialCode": "+423"
	},
	{
		"code": "LK",
		"emoji": "🇱🇰",
		"unicode": "U+1F1F1 U+1F1F0",
		"name": "Sri Lanka",
		"title": "flag for Sri Lanka",
		"dialCode": "+94"
	},
	{
		"code": "LR",
		"emoji": "🇱🇷",
		"unicode": "U+1F1F1 U+1F1F7",
		"name": "Liberia",
		"title": "flag for Liberia",
		"dialCode": "+231"
	},
	{
		"code": "LS",
		"emoji": "🇱🇸",
		"unicode": "U+1F1F1 U+1F1F8",
		"name": "Lesotho",
		"title": "flag for Lesotho",
		"dialCode": "+266"
	},
	{
		"code": "LT",
		"emoji": "🇱🇹",
		"unicode": "U+1F1F1 U+1F1F9",
		"name": "Lithuania",
		"title": "flag for Lithuania",
		"dialCode": "+370"
	},
	{
		"code": "LU",
		"emoji": "🇱🇺",
		"unicode": "U+1F1F1 U+1F1FA",
		"name": "Luxembourg",
		"title": "flag for Luxembourg",
		"dialCode": "+352"
	},
	{
		"code": "LV",
		"emoji": "🇱🇻",
		"unicode": "U+1F1F1 U+1F1FB",
		"name": "Latvia",
		"title": "flag for Latvia",
		"dialCode": "+371"
	},
	{
		"code": "LY",
		"emoji": "🇱🇾",
		"unicode": "U+1F1F1 U+1F1FE",
		"name": "Libya",
		"title": "flag for Libya",
		"dialCode": "+218"
	},
	{
		"code": "MA",
		"emoji": "🇲🇦",
		"unicode": "U+1F1F2 U+1F1E6",
		"name": "Morocco",
		"title": "flag for Morocco",
		"dialCode": "+212"
	},
	{
		"code": "MC",
		"emoji": "🇲🇨",
		"unicode": "U+1F1F2 U+1F1E8",
		"name": "Monaco",
		"title": "flag for Monaco",
		"dialCode": "+377"
	},
	{
		"code": "MD",
		"emoji": "🇲🇩",
		"unicode": "U+1F1F2 U+1F1E9",
		"name": "Moldova",
		"title": "flag for Moldova",
		"dialCode": "+373"
	},
	{
		"code": "ME",
		"emoji": "🇲🇪",
		"unicode": "U+1F1F2 U+1F1EA",
		"name": "Montenegro",
		"title": "flag for Montenegro",
		"dialCode": "+382"
	},
	{
		"code": "MF",
		"emoji": "🇲🇫",
		"unicode": "U+1F1F2 U+1F1EB",
		"name": "Saint Martin (French Part)",
		"title": "flag for Saint Martin (French Part)",
		"dialCode": "+590"
	},
	{
		"code": "MG",
		"emoji": "🇲🇬",
		"unicode": "U+1F1F2 U+1F1EC",
		"name": "Madagascar",
		"title": "flag for Madagascar",
		"dialCode": "+261"
	},
	{
		"code": "MH",
		"emoji": "🇲🇭",
		"unicode": "U+1F1F2 U+1F1ED",
		"name": "Marshall Islands",
		"title": "flag for Marshall Islands",
		"dialCode": "+692"
	},
	{
		"code": "MK",
		"emoji": "🇲🇰",
		"unicode": "U+1F1F2 U+1F1F0",
		"name": "Macedonia",
		"title": "flag for Macedonia",
		"dialCode": "+389"
	},
	{
		"code": "ML",
		"emoji": "🇲🇱",
		"unicode": "U+1F1F2 U+1F1F1",
		"name": "Mali",
		"title": "flag for Mali",
		"dialCode": "+223"
	},
	{
		"code": "MM",
		"emoji": "🇲🇲",
		"unicode": "U+1F1F2 U+1F1F2",
		"name": "Myanmar",
		"title": "flag for Myanmar",
		"dialCode": "+95"
	},
	{
		"code": "MN",
		"emoji": "🇲🇳",
		"unicode": "U+1F1F2 U+1F1F3",
		"name": "Mongolia",
		"title": "flag for Mongolia",
		"dialCode": "+976"
	},
	{
		"code": "MO",
		"emoji": "🇲🇴",
		"unicode": "U+1F1F2 U+1F1F4",
		"name": "Macao",
		"title": "flag for Macao",
		"dialCode": "+853"
	},
	{
		"code": "MP",
		"emoji": "🇲🇵",
		"unicode": "U+1F1F2 U+1F1F5",
		"name": "Northern Mariana Islands",
		"title": "flag for Northern Mariana Islands",
		"dialCode": "+1 670"
	},
	{
		"code": "MQ",
		"emoji": "🇲🇶",
		"unicode": "U+1F1F2 U+1F1F6",
		"name": "Martinique",
		"title": "flag for Martinique",
		"dialCode": "+596"
	},
	{
		"code": "MR",
		"emoji": "🇲🇷",
		"unicode": "U+1F1F2 U+1F1F7",
		"name": "Mauritania",
		"title": "flag for Mauritania",
		"dialCode": "+222"
	},
	{
		"code": "MS",
		"emoji": "🇲🇸",
		"unicode": "U+1F1F2 U+1F1F8",
		"name": "Montserrat",
		"title": "flag for Montserrat",
		"dialCode": "+1664"
	},
	{
		"code": "MT",
		"emoji": "🇲🇹",
		"unicode": "U+1F1F2 U+1F1F9",
		"name": "Malta",
		"title": "flag for Malta",
		"dialCode": "+356"
	},
	{
		"code": "MU",
		"emoji": "🇲🇺",
		"unicode": "U+1F1F2 U+1F1FA",
		"name": "Mauritius",
		"title": "flag for Mauritius",
		"dialCode": "+230"
	},
	{
		"code": "MV",
		"emoji": "🇲🇻",
		"unicode": "U+1F1F2 U+1F1FB",
		"name": "Maldives",
		"title": "flag for Maldives",
		"dialCode": "+960"
	},
	{
		"code": "MW",
		"emoji": "🇲🇼",
		"unicode": "U+1F1F2 U+1F1FC",
		"name": "Malawi",
		"title": "flag for Malawi",
		"dialCode": "+265"
	},
	{
		"code": "MX",
		"emoji": "🇲🇽",
		"unicode": "U+1F1F2 U+1F1FD",
		"name": "Mexico",
		"title": "flag for Mexico",
		"dialCode": "+52"
	},
	{
		"code": "MY",
		"emoji": "🇲🇾",
		"unicode": "U+1F1F2 U+1F1FE",
		"name": "Malaysia",
		"title": "flag for Malaysia",
		"dialCode": "+60"
	},
	{
		"code": "MZ",
		"emoji": "🇲🇿",
		"unicode": "U+1F1F2 U+1F1FF",
		"name": "Mozambique",
		"title": "flag for Mozambique",
		"dialCode": "+258"
	},
	{
		"code": "NA",
		"emoji": "🇳🇦",
		"unicode": "U+1F1F3 U+1F1E6",
		"name": "Namibia",
		"title": "flag for Namibia",
		"dialCode": "+264"
	},
	{
		"code": "NC",
		"emoji": "🇳🇨",
		"unicode": "U+1F1F3 U+1F1E8",
		"name": "New Caledonia",
		"title": "flag for New Caledonia",
		"dialCode": "+687"
	},
	{
		"code": "NE",
		"emoji": "🇳🇪",
		"unicode": "U+1F1F3 U+1F1EA",
		"name": "Niger",
		"title": "flag for Niger",
		"dialCode": "+227"
	},
	{
		"code": "NF",
		"emoji": "🇳🇫",
		"unicode": "U+1F1F3 U+1F1EB",
		"name": "Norfolk Island",
		"title": "flag for Norfolk Island",
		"dialCode": "+672"
	},
	{
		"code": "NG",
		"emoji": "🇳🇬",
		"unicode": "U+1F1F3 U+1F1EC",
		"name": "Nigeria",
		"title": "flag for Nigeria",
		"dialCode": "+234"
	},
	{
		"code": "NI",
		"emoji": "🇳🇮",
		"unicode": "U+1F1F3 U+1F1EE",
		"name": "Nicaragua",
		"title": "flag for Nicaragua",
		"dialCode": "+505"
	},
	{
		"code": "NL",
		"emoji": "🇳🇱",
		"unicode": "U+1F1F3 U+1F1F1",
		"name": "Netherlands",
		"title": "flag for Netherlands",
		"dialCode": "+31"
	},
	{
		"code": "NO",
		"emoji": "🇳🇴",
		"unicode": "U+1F1F3 U+1F1F4",
		"name": "Norway",
		"title": "flag for Norway",
		"dialCode": "+47"
	},
	{
		"code": "NP",
		"emoji": "🇳🇵",
		"unicode": "U+1F1F3 U+1F1F5",
		"name": "Nepal",
		"title": "flag for Nepal",
		"dialCode": "+977"
	},
	{
		"code": "NR",
		"emoji": "🇳🇷",
		"unicode": "U+1F1F3 U+1F1F7",
		"name": "Nauru",
		"title": "flag for Nauru",
		"dialCode": "+674"
	},
	{
		"code": "NU",
		"emoji": "🇳🇺",
		"unicode": "U+1F1F3 U+1F1FA",
		"name": "Niue",
		"title": "flag for Niue",
		"dialCode": "+683"
	},
	{
		"code": "NZ",
		"emoji": "🇳🇿",
		"unicode": "U+1F1F3 U+1F1FF",
		"name": "New Zealand",
		"title": "flag for New Zealand",
		"dialCode": "+64"
	},
	{
		"code": "OM",
		"emoji": "🇴🇲",
		"unicode": "U+1F1F4 U+1F1F2",
		"name": "Oman",
		"title": "flag for Oman",
		"dialCode": "+968"
	},
	{
		"code": "PA",
		"emoji": "🇵🇦",
		"unicode": "U+1F1F5 U+1F1E6",
		"name": "Panama",
		"title": "flag for Panama",
		"dialCode": "+507"
	},
	{
		"code": "PE",
		"emoji": "🇵🇪",
		"unicode": "U+1F1F5 U+1F1EA",
		"name": "Peru",
		"title": "flag for Peru",
		"dialCode": "+51"
	},
	{
		"code": "PF",
		"emoji": "🇵🇫",
		"unicode": "U+1F1F5 U+1F1EB",
		"name": "French Polynesia",
		"title": "flag for French Polynesia",
		"dialCode": "+689"
	},
	{
		"code": "PG",
		"emoji": "🇵🇬",
		"unicode": "U+1F1F5 U+1F1EC",
		"name": "Papua New Guinea",
		"title": "flag for Papua New Guinea",
		"dialCode": "+675"
	},
	{
		"code": "PH",
		"emoji": "🇵🇭",
		"unicode": "U+1F1F5 U+1F1ED",
		"name": "Philippines",
		"title": "flag for Philippines",
		"dialCode": "+63"
	},
	{
		"code": "PK",
		"emoji": "🇵🇰",
		"unicode": "U+1F1F5 U+1F1F0",
		"name": "Pakistan",
		"title": "flag for Pakistan",
		"dialCode": "+92"
	},
	{
		"code": "PL",
		"emoji": "🇵🇱",
		"unicode": "U+1F1F5 U+1F1F1",
		"name": "Poland",
		"title": "flag for Poland",
		"dialCode": "+48"
	},
	{
		"code": "PM",
		"emoji": "🇵🇲",
		"unicode": "U+1F1F5 U+1F1F2",
		"name": "Saint Pierre and Miquelon",
		"title": "flag for Saint Pierre and Miquelon",
		"dialCode": "+508"
	},
	{
		"code": "PN",
		"emoji": "🇵🇳",
		"unicode": "U+1F1F5 U+1F1F3",
		"name": "Pitcairn",
		"title": "flag for Pitcairn",
		"dialCode": "+872"
	},
	{
		"code": "PR",
		"emoji": "🇵🇷",
		"unicode": "U+1F1F5 U+1F1F7",
		"name": "Puerto Rico",
		"title": "flag for Puerto Rico",
		"dialCode": "+1 939"
	},
	{
		"code": "PS",
		"emoji": "🇵🇸",
		"unicode": "U+1F1F5 U+1F1F8",
		"name": "Palestinian Territory",
		"title": "flag for Palestinian Territory",
		"dialCode": "+970"
	},
	{
		"code": "PT",
		"emoji": "🇵🇹",
		"unicode": "U+1F1F5 U+1F1F9",
		"name": "Portugal",
		"title": "flag for Portugal",
		"dialCode": "+351"
	},
	{
		"code": "PW",
		"emoji": "🇵🇼",
		"unicode": "U+1F1F5 U+1F1FC",
		"name": "Palau",
		"title": "flag for Palau",
		"dialCode": "+680"
	},
	{
		"code": "PY",
		"emoji": "🇵🇾",
		"unicode": "U+1F1F5 U+1F1FE",
		"name": "Paraguay",
		"title": "flag for Paraguay",
		"dialCode": "+595"
	},
	{
		"code": "QA",
		"emoji": "🇶🇦",
		"unicode": "U+1F1F6 U+1F1E6",
		"name": "Qatar",
		"title": "flag for Qatar",
		"dialCode": "+974"
	},
	{
		"code": "RE",
		"emoji": "🇷🇪",
		"unicode": "U+1F1F7 U+1F1EA",
		"name": "Réunion",
		"title": "flag for Réunion",
		"dialCode": "+262"
	},
	{
		"code": "RO",
		"emoji": "🇷🇴",
		"unicode": "U+1F1F7 U+1F1F4",
		"name": "Romania",
		"title": "flag for Romania",
		"dialCode": "+40"
	},
	{
		"code": "RS",
		"emoji": "🇷🇸",
		"unicode": "U+1F1F7 U+1F1F8",
		"name": "Serbia",
		"title": "flag for Serbia",
		"dialCode": "+381"
	},
	{
		"code": "RU",
		"emoji": "🇷🇺",
		"unicode": "U+1F1F7 U+1F1FA",
		"name": "Russia",
		"title": "flag for Russia",
		"dialCode": "+7"
	},
	{
		"code": "RW",
		"emoji": "🇷🇼",
		"unicode": "U+1F1F7 U+1F1FC",
		"name": "Rwanda",
		"title": "flag for Rwanda",
		"dialCode": "+250"
	},
	{
		"code": "SA",
		"emoji": "🇸🇦",
		"unicode": "U+1F1F8 U+1F1E6",
		"name": "Saudi Arabia",
		"title": "flag for Saudi Arabia",
		"dialCode": "+966"
	},
	{
		"code": "SB",
		"emoji": "🇸🇧",
		"unicode": "U+1F1F8 U+1F1E7",
		"name": "Solomon Islands",
		"title": "flag for Solomon Islands",
		"dialCode": "+677"
	},
	{
		"code": "SC",
		"emoji": "🇸🇨",
		"unicode": "U+1F1F8 U+1F1E8",
		"name": "Seychelles",
		"title": "flag for Seychelles",
		"dialCode": "+248"
	},
	{
		"code": "SD",
		"emoji": "🇸🇩",
		"unicode": "U+1F1F8 U+1F1E9",
		"name": "Sudan",
		"title": "flag for Sudan",
		"dialCode": "+249"
	},
	{
		"code": "SE",
		"emoji": "🇸🇪",
		"unicode": "U+1F1F8 U+1F1EA",
		"name": "Sweden",
		"title": "flag for Sweden",
		"dialCode": "+46"
	},
	{
		"code": "SG",
		"emoji": "🇸🇬",
		"unicode": "U+1F1F8 U+1F1EC",
		"name": "Singapore",
		"title": "flag for Singapore",
		"dialCode": "+65"
	},
	{
		"code": "SH",
		"emoji": "🇸🇭",
		"unicode": "U+1F1F8 U+1F1ED",
		"name": "Saint Helena, Ascension and Tristan Da Cunha",
		"title": "flag for Saint Helena, Ascension and Tristan Da Cunha",
		"dialCode": "+290"
	},
	{
		"code": "SI",
		"emoji": "🇸🇮",
		"unicode": "U+1F1F8 U+1F1EE",
		"name": "Slovenia",
		"title": "flag for Slovenia",
		"dialCode": "+386"
	},
	{
		"code": "SJ",
		"emoji": "🇸🇯",
		"unicode": "U+1F1F8 U+1F1EF",
		"name": "Svalbard and Jan Mayen",
		"title": "flag for Svalbard and Jan Mayen",
		"dialCode": "+47"
	},
	{
		"code": "SK",
		"emoji": "🇸🇰",
		"unicode": "U+1F1F8 U+1F1F0",
		"name": "Slovakia",
		"title": "flag for Slovakia",
		"dialCode": "+421"
	},
	{
		"code": "SL",
		"emoji": "🇸🇱",
		"unicode": "U+1F1F8 U+1F1F1",
		"name": "Sierra Leone",
		"title": "flag for Sierra Leone",
		"dialCode": "+232"
	},
	{
		"code": "SM",
		"emoji": "🇸🇲",
		"unicode": "U+1F1F8 U+1F1F2",
		"name": "San Marino",
		"title": "flag for San Marino",
		"dialCode": "+378"
	},
	{
		"code": "SN",
		"emoji": "🇸🇳",
		"unicode": "U+1F1F8 U+1F1F3",
		"name": "Senegal",
		"title": "flag for Senegal",
		"dialCode": "+221"
	},
	{
		"code": "SO",
		"emoji": "🇸🇴",
		"unicode": "U+1F1F8 U+1F1F4",
		"name": "Somalia",
		"title": "flag for Somalia",
		"dialCode": "+252"
	},
	{
		"code": "SR",
		"emoji": "🇸🇷",
		"unicode": "U+1F1F8 U+1F1F7",
		"name": "Suriname",
		"title": "flag for Suriname",
		"dialCode": "+597"
	},
	{
		"code": "SS",
		"emoji": "🇸🇸",
		"unicode": "U+1F1F8 U+1F1F8",
		"name": "South Sudan",
		"title": "flag for South Sudan"
	},
	{
		"code": "ST",
		"emoji": "🇸🇹",
		"unicode": "U+1F1F8 U+1F1F9",
		"name": "Sao Tome and Principe",
		"title": "flag for Sao Tome and Principe",
		"dialCode": "+239"
	},
	{
		"code": "SV",
		"emoji": "🇸🇻",
		"unicode": "U+1F1F8 U+1F1FB",
		"name": "El Salvador",
		"title": "flag for El Salvador",
		"dialCode": "+503"
	},
	{
		"code": "SX",
		"emoji": "🇸🇽",
		"unicode": "U+1F1F8 U+1F1FD",
		"name": "Sint Maarten (Dutch Part)",
		"title": "flag for Sint Maarten (Dutch Part)"
	},
	{
		"code": "SY",
		"emoji": "🇸🇾",
		"unicode": "U+1F1F8 U+1F1FE",
		"name": "Syrian Arab Republic",
		"title": "flag for Syrian Arab Republic",
		"dialCode": "+963"
	},
	{
		"code": "SZ",
		"emoji": "🇸🇿",
		"unicode": "U+1F1F8 U+1F1FF",
		"name": "Swaziland",
		"title": "flag for Swaziland",
		"dialCode": "+268"
	},
	{
		"code": "TC",
		"emoji": "🇹🇨",
		"unicode": "U+1F1F9 U+1F1E8",
		"name": "Turks and Caicos Islands",
		"title": "flag for Turks and Caicos Islands",
		"dialCode": "+1 649"
	},
	{
		"code": "TD",
		"emoji": "🇹🇩",
		"unicode": "U+1F1F9 U+1F1E9",
		"name": "Chad",
		"title": "flag for Chad",
		"dialCode": "+235"
	},
	{
		"code": "TF",
		"emoji": "🇹🇫",
		"unicode": "U+1F1F9 U+1F1EB",
		"name": "French Southern Territories",
		"title": "flag for French Southern Territories"
	},
	{
		"code": "TG",
		"emoji": "🇹🇬",
		"unicode": "U+1F1F9 U+1F1EC",
		"name": "Togo",
		"title": "flag for Togo",
		"dialCode": "+228"
	},
	{
		"code": "TH",
		"emoji": "🇹🇭",
		"unicode": "U+1F1F9 U+1F1ED",
		"name": "Thailand",
		"title": "flag for Thailand",
		"dialCode": "+66"
	},
	{
		"code": "TJ",
		"emoji": "🇹🇯",
		"unicode": "U+1F1F9 U+1F1EF",
		"name": "Tajikistan",
		"title": "flag for Tajikistan",
		"dialCode": "+992"
	},
	{
		"code": "TK",
		"emoji": "🇹🇰",
		"unicode": "U+1F1F9 U+1F1F0",
		"name": "Tokelau",
		"title": "flag for Tokelau",
		"dialCode": "+690"
	},
	{
		"code": "TL",
		"emoji": "🇹🇱",
		"unicode": "U+1F1F9 U+1F1F1",
		"name": "Timor-Leste",
		"title": "flag for Timor-Leste",
		"dialCode": "+670"
	},
	{
		"code": "TM",
		"emoji": "🇹🇲",
		"unicode": "U+1F1F9 U+1F1F2",
		"name": "Turkmenistan",
		"title": "flag for Turkmenistan",
		"dialCode": "+993"
	},
	{
		"code": "TN",
		"emoji": "🇹🇳",
		"unicode": "U+1F1F9 U+1F1F3",
		"name": "Tunisia",
		"title": "flag for Tunisia",
		"dialCode": "+216"
	},
	{
		"code": "TO",
		"emoji": "🇹🇴",
		"unicode": "U+1F1F9 U+1F1F4",
		"name": "Tonga",
		"title": "flag for Tonga",
		"dialCode": "+676"
	},
	{
		"code": "TR",
		"emoji": "🇹🇷",
		"unicode": "U+1F1F9 U+1F1F7",
		"name": "Turkey",
		"title": "flag for Turkey",
		"dialCode": "+90"
	},
	{
		"code": "TT",
		"emoji": "🇹🇹",
		"unicode": "U+1F1F9 U+1F1F9",
		"name": "Trinidad and Tobago",
		"title": "flag for Trinidad and Tobago",
		"dialCode": "+1 868"
	},
	{
		"code": "TV",
		"emoji": "🇹🇻",
		"unicode": "U+1F1F9 U+1F1FB",
		"name": "Tuvalu",
		"title": "flag for Tuvalu",
		"dialCode": "+688"
	},
	{
		"code": "TW",
		"emoji": "🇹🇼",
		"unicode": "U+1F1F9 U+1F1FC",
		"name": "Taiwan",
		"title": "flag for Taiwan",
		"dialCode": "+886"
	},
	{
		"code": "TZ",
		"emoji": "🇹🇿",
		"unicode": "U+1F1F9 U+1F1FF",
		"name": "Tanzania",
		"title": "flag for Tanzania",
		"dialCode": "+255"
	},
	{
		"code": "UA",
		"emoji": "🇺🇦",
		"unicode": "U+1F1FA U+1F1E6",
		"name": "Ukraine",
		"title": "flag for Ukraine",
		"dialCode": "+380"
	},
	{
		"code": "UG",
		"emoji": "🇺🇬",
		"unicode": "U+1F1FA U+1F1EC",
		"name": "Uganda",
		"title": "flag for Uganda",
		"dialCode": "+256"
	},
	{
		"code": "UM",
		"emoji": "🇺🇲",
		"unicode": "U+1F1FA U+1F1F2",
		"name": "United States Minor Outlying Islands",
		"title": "flag for United States Minor Outlying Islands"
	},
	{
		"code": "US",
		"emoji": "🇺🇸",
		"unicode": "U+1F1FA U+1F1F8",
		"name": "United States",
		"title": "flag for United States",
		"dialCode": "+1"
	},
	{
		"code": "UY",
		"emoji": "🇺🇾",
		"unicode": "U+1F1FA U+1F1FE",
		"name": "Uruguay",
		"title": "flag for Uruguay",
		"dialCode": "+598"
	},
	{
		"code": "UZ",
		"emoji": "🇺🇿",
		"unicode": "U+1F1FA U+1F1FF",
		"name": "Uzbekistan",
		"title": "flag for Uzbekistan",
		"dialCode": "+998"
	},
	{
		"code": "VA",
		"emoji": "🇻🇦",
		"unicode": "U+1F1FB U+1F1E6",
		"name": "Vatican City",
		"title": "flag for Vatican City",
		"dialCode": "+379"
	},
	{
		"code": "VC",
		"emoji": "🇻🇨",
		"unicode": "U+1F1FB U+1F1E8",
		"name": "Saint Vincent and The Grenadines",
		"title": "flag for Saint Vincent and The Grenadines",
		"dialCode": "+1 784"
	},
	{
		"code": "VE",
		"emoji": "🇻🇪",
		"unicode": "U+1F1FB U+1F1EA",
		"name": "Venezuela",
		"title": "flag for Venezuela",
		"dialCode": "+58"
	},
	{
		"code": "VG",
		"emoji": "🇻🇬",
		"unicode": "U+1F1FB U+1F1EC",
		"name": "Virgin Islands, British",
		"title": "flag for Virgin Islands, British",
		"dialCode": "+1 284"
	},
	{
		"code": "VI",
		"emoji": "🇻🇮",
		"unicode": "U+1F1FB U+1F1EE",
		"name": "Virgin Islands, U.S.",
		"title": "flag for Virgin Islands, U.S.",
		"dialCode": "+1 340"
	},
	{
		"code": "VN",
		"emoji": "🇻🇳",
		"unicode": "U+1F1FB U+1F1F3",
		"name": "Viet Nam",
		"title": "flag for Viet Nam",
		"dialCode": "+84"
	},
	{
		"code": "VU",
		"emoji": "🇻🇺",
		"unicode": "U+1F1FB U+1F1FA",
		"name": "Vanuatu",
		"title": "flag for Vanuatu",
		"dialCode": "+678"
	},
	{
		"code": "WF",
		"emoji": "🇼🇫",
		"unicode": "U+1F1FC U+1F1EB",
		"name": "Wallis and Futuna",
		"title": "flag for Wallis and Futuna",
		"dialCode": "+681"
	},
	{
		"code": "WS",
		"emoji": "🇼🇸",
		"unicode": "U+1F1FC U+1F1F8",
		"name": "Samoa",
		"title": "flag for Samoa",
		"dialCode": "+685"
	},
	{
		"code": "XK",
		"emoji": "🇽🇰",
		"unicode": "U+1F1FD U+1F1F0",
		"name": "Kosovo",
		"title": "flag for Kosovo",
		"dialCode": "+383"
	},
	{
		"code": "YE",
		"emoji": "🇾🇪",
		"unicode": "U+1F1FE U+1F1EA",
		"name": "Yemen",
		"title": "flag for Yemen",
		"dialCode": "+967"
	},
	{
		"code": "YT",
		"emoji": "🇾🇹",
		"unicode": "U+1F1FE U+1F1F9",
		"name": "Mayotte",
		"title": "flag for Mayotte",
		"dialCode": "+262"
	},
	{
		"code": "ZA",
		"emoji": "🇿🇦",
		"unicode": "U+1F1FF U+1F1E6",
		"name": "South Africa",
		"title": "flag for South Africa",
		"dialCode": "+27"
	},
	{
		"code": "ZM",
		"emoji": "🇿🇲",
		"unicode": "U+1F1FF U+1F1F2",
		"name": "Zambia",
		"title": "flag for Zambia",
		"dialCode": "+260"
	},
	{
		"code": "ZW",
		"emoji": "🇿🇼",
		"unicode": "U+1F1FF U+1F1FC",
		"name": "Zimbabwe",
		"title": "flag for Zimbabwe",
		"dialCode": "+263"
	}
];

