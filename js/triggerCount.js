$(document).ready(function() {
	$.each($('.js-countup'), function () {
	    var count = $(this).data('count'),
	        numAnim = new CountUp(this, 0, count, 0, 3);

	    $(this).parent().css( 'width', count.toString() + '%');

	    numAnim.start();
	});

});