$(document).ready(function () {
	
	$('.js-tooltip-login').attr('title', 'Input registered email and password or use guest access if you don\'t have account yet');
	
	$('.js-tooltip-filters').attr('title', 'Specify the data you are looking for');
	
	$('.js-tooltip-filters-dates').attr('title', 'Show data only in this date range');
	
	$('.js-tooltip-filters-emotions').attr('title', '');
	
	$('.js-tooltip-filters-exp').attr('title', 'Show data only for selected experiences');
	
	$('.js-tooltip-filters-country').attr('title', 'Show data of users only from selected countries');
	
	$('.js-tooltip-filters-age').attr('title', 'Show users only from selected age range');
	
	$('.js-tooltip-bert').attr('title', 'Special index which describes users emotions in common. 1 is good, 0 is neutral, -1 is bad.');
	
	$('.js-tooltip-emotional-journey').attr('title', 'Emotions by time');
	
	$('.js-tooltip-emotions').attr('title', 'Percentage of emotions');
	
	$('.js-tooltip-exp').attr('title', 'How much time users spend on experience (in seconds)');
	
	$('.js-tooltip-country').attr('title', 'Overall time of app using by country');
	
	$('.js-tooltip-age').attr('title', 'Age distribution');
	
	$('.js-tooltip-gender').attr('title', 'Gender distribution');
});
