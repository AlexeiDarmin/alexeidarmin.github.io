var carouselIndex = 0;
var carouselDirection = 1; // 1 right, 0 left
var carouselLength = 2;

$(document).ready(function(){
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
	     queue:true,
       complete: adjustDisplacement /* avoids bug if window resized mid animation */
	});
}

/* Slides carousel one slide to the left */
function slideLeft(){
	var slideDistance = $('.slide').css('width');
  $('#carouselWrapper').animate({'margin-left': '+=' + slideDistance}, 
    	{duration:750,
	     queue:true,
       complete: adjustDisplacement /* avoids bug if window resized mid animation */
	});
}

/* Restrains slide width to container width */
function calculateDimensions() {
  var carouselWidth = $('#carouselContainer').outerWidth();
  $('#carouselWrapper > .slide').css('width', carouselWidth);
  $('#carouselWrapper > .slide img').css('width', carouselWidth);
  $('#carouselWrapper').css('width', 99999999999);
}

/* Restrains slide width to container width */
function adjustDisplacement() {
  var displacementRaw = parseInt($('#carouselWrapper > .slide').innerWidth()) * carouselIndex * -1;
  var displacementString = displacementRaw.toString() + 'px';
  $('#carouselWrapper').css('margin-left', displacementString);
}

window.onload = calculateDimensions;
$(window).resize(calculateDimensions);
$(window).resize(adjustDisplacement);