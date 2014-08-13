function boidie(bar) {
	this.bar = bar;
	this.blank = {
		firstName: '',
		lastName: '',
		category: '',
		bio: '',
		interestes: '',
	};
}

function rotate($el, degrees) {
    $el.css({
  '-webkit-transform' : 'rotate('+degrees+'deg)',
     '-moz-transform' : 'rotate('+degrees+'deg)',
      '-ms-transform' : 'rotate('+degrees+'deg)',
       '-o-transform' : 'rotate('+degrees+'deg)',
          'transform' : 'rotate('+degrees+'deg)',
               'zoom' : 1

    });
    degrees -= 10;
    if(degrees > -90) {
    	setTimeout(function() { rotate($el, degrees); },15);
    }

}

