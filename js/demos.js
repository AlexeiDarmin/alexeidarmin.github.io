var carouselIndex = 0;
var carouselDirection = 1; // 1 right, 0 left
var carouselLength = 3;

$(document).ready(function(){
	alert(carouselLength);
});


var carouselInterval = window.setInterval(function() {
    if (carouselDirection == 1){
   		if (carouselIndex < carouselLength) {
   			carouselIndex += 1;
   			slideRight();
   		}
   		if (carouselIndex == carouselLength) carouselDirection = -1;
   	} else {
   		if (carouselIndex > 0) {
   			carouselIndex -= 1;
   			slideLeft();
   		}
   		if (carouselIndex == 0) carouselDirection = 1;
   	}
   }, 3500);

/* Slides carousel one slide to the right */
function slideRight(){
  	var slideDistance = $('.slide').css('width');
    $('#carouselWrapper').animate({'margin-left': '-=' + slideDistance}, 
    	{duration:750,
	     queue:true
	});
}

/* Slides carousel one slide to the left */
function slideLeft(){
	    var slideDistance = $('.slide').css('width');
    $('#carouselWrapper').animate({'margin-left': '+=' + slideDistance}, 
    	{duration:750,
	     queue:true
	});
}