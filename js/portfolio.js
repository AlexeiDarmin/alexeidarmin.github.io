$("#portfolio > img").click(function(){
	var filename = "portfolio/" + $(this).data('portfolio') + ".html";
    $.get(filename, function(data){
        $('.modal-content').html(data);
    });
});

$(document).ready(function(){
	var delayAmount = 500;
	var duration = 500;
	$.each($('#portfolio > img'), function () {
		$(this).delay(delayAmount).fadeIn(duration);
		delayAmount = delayAmount + 250;
	});
});