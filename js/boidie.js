// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var utilsAPI = require('./utils.js');
	var utils = new utilsAPI();
	var document = {};
}

function boidie(name) {
	this.name = name;
	this.energy = 20;
	this.mateEnergy = 0.0;
	this.mateCount = 3;
	this.setState(this.working);

	this.blank = {
		firstName: '',
		lastName: '',
		category: '',
		bio: '',
		interestes: '',
	};
}

boidie.prototype.setState = function(state) {
	this.activeState = state;
}
boidie.prototype.update = function() {
	if(this.activeState != undefined) {
		this.activeState();
	}
}

boidie.prototype.eating = function() {
	this.energy++;
	//console.log("Sleep energy: "+energy);
	if(this.energy > 20) {
		console.log("Start working");

		//actionRef.push({ type: "tweet", msg: "Hello World" });
		this.setState(this.working);
	}
}
boidie.prototype.working = function() {
	this.energy--;
	this.mateEnergy += 0.3;
	console.log("Work energy: "+this.energy+" Mate energy:"+this.mateEnergy);
	if(this.mateEnergy > 10) {
		console.log("Start mating");
		this.mateCount = 3;
		this.setState(this.mating);
	} else if(this.energy < 10) {
		console.log("Start eating");
		this.setState(this.eating);
	}
}
boidie.prototype.sleeping = function() {

}
boidie.prototype.mating = function() {
	this.mateCount--;
	if(this.mateCount < 1) {
		this.mateEnergy = 0.0;
		console.log("Start eating");
		this.setState(this.eating);
	} else if(this.mateCount == 1) {
		console.log("Creating boid");
		var male = false;
		var female = false;
		this.create(male, female);
	}

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

