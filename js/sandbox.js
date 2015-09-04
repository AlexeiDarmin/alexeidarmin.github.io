/* Globals */
var SPEED = 1500;
var fadingCarouselIndex = 1;



$(document).ready(function(){
	//Removes spaces, eliminating string text nodes for easier traversal.
	$.trim(document);

	initEverything();
});

function initEverything(){
	var fadingCarouselInterval = setInterval(function () {fadingCarousel();},4000);
}


function fadingCarousel(){
	$("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeOut(SPEED);
	if ($("#fadingCarousel > .slide").length == fadingCarouselIndex) {
		fadingCarouselIndex = 1;
	}
	else {
		fadingCarouselIndex = fadingCarouselIndex + 1;
	}
	$("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeIn(SPEED);
}

$( "#fadingCarousel > button.next" ).click(function() {
  //Disables buttons to avoid multiple slide switches.
  $(this).attr("disabled", true);
  $('#fadingCarousel > button.previous').attr("disabled", true);

  $("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeOut(SPEED);
	if ($("#fadingCarousel > .slide").length == fadingCarouselIndex) {
		fadingCarouselIndex = 1;
	}
	else {
		fadingCarouselIndex = fadingCarouselIndex + 1;
	}
	$("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeIn(SPEED, function(){
		  //Enables buttons after animation length time delay.
          $('#fadingCarousel > button.previous').attr("disabled", false).delay(SPEED);
          $('#fadingCarousel > button.next').attr("disabled", false).delay(SPEED);
	});
});

$( "#fadingCarousel > button.previous" ).click(function() {
  //Disables buttons to avoid multiple slide switches.
  $(this).attr("disabled", true);
  $('#fadingCarousel > button.next').attr("disabled", true);

  $("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeOut(SPEED);
	if (fadingCarouselIndex == 1) {
		fadingCarouselIndex = $("#fadingCarousel > .slide").length;
	}
	else {
		fadingCarouselIndex = fadingCarouselIndex - 1;
	}
	$("#fadingCarousel > .slide:nth-child("+ fadingCarouselIndex +")").fadeIn(SPEED, function(){
		  //Enables buttons after animation length time delay.
          $('#fadingCarousel > button.previous').attr("disabled", false).delay(SPEED);
          $('#fadingCarousel > button.next').attr("disabled", false).delay(SPEED);
	});
});