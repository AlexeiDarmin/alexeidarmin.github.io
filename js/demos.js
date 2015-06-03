var carouselIndex = 0;
var carouselDirection = 1; // 1 right, 0 left
var carouselLength = 2;
var animationInProgress = false;

$(document).ready(function(){

  $(window).resize(function(){
    if (! animationInProgress) {
      calculateDimensions();
      adjustDisplacement();
    }
  });

  window.onload = function(){
    document.getElementById('carouselWrapper').style.display = "inline-block";
    calculateDimensions();
  };
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
   }, 3000);

/* Slides carousel one slide to the right */
function slideRight(){
  var slideDistance = parseInt($('.slide').css('width'));
  var currentPositionInt = parseInt($('#carouselWrapper').css('margin-left'));
  var computedDistance = currentPositionInt - slideDistance;
  var newDistance = computedDistance.toString() + 'px';
  animationInProgress = true; /* disables resizes during slide animation */
  $('#carouselWrapper').velocity({'margin-left': newDistance}, 
    	{duration:750,
       easing: "ease-in-out",
       complete: animationEnd /* avoids bug if window resized mid animation */
	});
}

/* Slides carousel one slide to the left */
function slideLeft(){
	var slideDistance = parseInt($('.slide').css('width'));
  var currentPositionInt = parseInt($('#carouselWrapper').css('margin-left'));
  var computedDistance = slideDistance + currentPositionInt;
  var newDistance = computedDistance.toString() + 'px';
  animationInProgress = true; /* disables resizes during slide animation */
  $('#carouselWrapper').velocity({'margin-left': newDistance}, 
    	{duration:750,
       easing: "ease-in-out",
       complete: animationEnd /* avoids bug if window resized mid animation */
	});
}

/* re-enable resizing of slider after animation ends */
function animationEnd(){
  animationInProgress = false;
  calculateDimensions();
  adjustDisplacement();
}

/* Restrains slide width to container width */
function calculateDimensions() {
  var carouselWidth = $('#carouselContainer').outerWidth();
  $('#carouselWrapper > .slide').css('width', carouselWidth);
  //$('#carouselWrapper > .slide img').css('width', carouselWidth);
  $('#carouselWrapper').css('width', 5000);
}

/* Restrains slide width to container width */
function adjustDisplacement() {
  var displacementRaw = parseInt($('#carouselContainer').innerWidth()) * carouselIndex * -1;
  var displacementString = displacementRaw.toString() + 'px';
  $('#carouselWrapper').css('margin-left', displacementString);
}