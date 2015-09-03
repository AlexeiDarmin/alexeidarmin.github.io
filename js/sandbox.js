$(document).ready(function(){
	var carouselFade = new FadingCarousel();
	carouselFade.nextSlide();
})

// The object with a default index (representing current slide)
function FadingCarousel() {
    this.index = 0;
    clean(document.getElementById('fadingCarousel'))
    this.carousel = document.getElementById('fadingCarousel');
    this.slides = this.carousel.childNodes;
}

// Carousel Functions
FadingCarousel.prototype = {
    nextSlide: function(){
    	this.slides[this.index].style.opacity=0;
    	this.slides[this.index + 1].style.opacity=1;
    }
};


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