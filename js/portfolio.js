$("#portfolio > img").click(function(){
	var filename = "portfolio/" + $(this).data('portfolio') + ".html";
    $.get(filename, function(data){
        $('.modal-content').html(data);
    });
});