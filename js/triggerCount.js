$(document).ready(function() {
	$.each($('.js-countup'), function () {
		var count = $(this).parent().css('max-width');
	    $(this).parent().css( 'width', count);
	});
});