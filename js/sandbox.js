/* Globals */
var SPEED = 1500;
var fadingCarouselIndex = 1;



$(document).ready(function(){
	$.trim(document);
	initEverything();
});

function initEverything(){
	setInterval(function () {fadingCarousel();},4000);
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