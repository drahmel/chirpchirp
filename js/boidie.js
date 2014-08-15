// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var utilsAPI = require('./utils.js');
	var utils = new utilsAPI();
	var document = {};
}

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

/*
Possible Genes (Dominant_Recessive):
	NightOwl_EarlyRiser
	Follower_Trailblazer
	CurtPoster_VerbosePoster
	PreferTweet_PreferRetweet
	Comment_NoComment
*/

boidie.prototype.create = function(db, mother, father) {
	var gender = 10*Math.random() > 4 ? 'm' : 'f';
	var temperature = parseInt(Math.nrand(75, 5));
	var age = utils.getLinuxTime();
	var deathAge = age + parseInt(3600*Math.random());
	var name = (gender=='m') ? "Sam"+temperature : "Pam"+temperature;
	db.push(
		{
			name: name,
			gender: gender,
			alive: 1,
			deathAge: deathAge,
			birthTime: age,
			temperature: temperature,
			mother: mother,
			father: father,
			chromosomes: {
				looks: {
					EyesBrownBlue: "AA",
					HairBrownBlond: "AA",
				},
				speed: {},
				personality: {}
			}
		}
	);
	console.log("Added "+name);
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


if(false) {
	creaturesRef.set({
		c1: {
			name: "Adam",
			gender: "m",
			alive: 1,
			birthTime: getLinuxTime(),
			temperature: parseInt(Math.nrand(75, 5)),
			chromosomes: {
				looks: {
					EyesBrownBlue: "Aa",
					HairBrownBlond: "AA",
				},
				speed: {},
				personality: {}
			}
		},
		c2: {
			name: "Eve",
			gender: "f",
			alive: 1,
			birthTime: getLinuxTime(),
			temperature: parseInt(Math.nrand(75, 5)),
			chromosomes: {
				looks: {
					EyesBrownBlue: "aa",
					HairBrownBlond: "aA",
				},
				speed: {},
				personality: {}
			}
		}
	});
}
/*
$('#messageInput').keypress(function (e) {
	if (e.keyCode == 13) {
		var name = $('#nameInput').val();
		var text = $('#messageInput').val();
		myDataRef.push({name: name, text: text});
		$('#messageInput').val('');
	}
});
*/

module.exports = boidie;

