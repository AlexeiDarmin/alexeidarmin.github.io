$(document).ready(function(){
	//alert('demos jquery achieved');
});

var carouselIndex = 0;
var carouselDirection = 1; //right


var carouselInterval = window.setInterval(function() {
   	if (carouselDirection == 1){
   		if (carouselIndex < 3) {
   			carouselIndex += 1;
   			slideRight();
   		}
   		if (carouselIndex == 3) carouselDirection = -1;
   	} else {
   		if (carouselIndex > 0) {
   			carouselIndex -= 1;
   			slideLeft();
   		}
   		if (carouselIndex == 0) carouselDirection = 1;
   	}
   }, 7500);

/* Slides carousel one slide to the right */
function slideRight(){
  	var slideDistance = $('.slide').css('width');
    $('#slideWrapper').animate({'margin-left': '-=' + slideDistance}, 
    	{duration:750,
	     queue:true
	});
}

/* Slides carousel one slide to the left */
function slideLeft(){
	    var slideDistance = $('.slide').css('width');
    $('#slideWrapper').animate({'margin-left': '+=' + slideDistance}, 
    	{duration:750,
	     queue:true
	});
}