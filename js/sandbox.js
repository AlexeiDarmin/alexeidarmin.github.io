/* Globals */
var SPEED = 1500;
var fadingCarouselIndex = 1;



$(document).ready(function(){
	clean(document);
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

/* Removes junk nodes (text/comments), returning only HTML. */
function clean(node)
{
  for(var n = 0; n < node.childNodes.length; n ++)
  {
    var child = node.childNodes[n];
    if
    (
      child.nodeType === 8 
      || 
      (child.nodeType === 3 && !/\S/.test(child.nodeValue))
    )
    {
      node.removeChild(child);
      n --;
    }
    else if(child.nodeType === 1)
    {
      clean(child);
    }
  }
}