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
	this.utils = utils;

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

function chromosome(type) {
	this.type = type;
	this.genes = {};
	this.addGene = function(name, gene) {
		this.genes[name] = gene;
	};
	this.getGenes = function() {
		return this.genes;
	}
	this.addInputs = function() {
		for(var i in this.genes) {
			$("<div>"+i +"<input name='"+i+"' value='"+this.genes[i]+"' /></div>").appendTo("#txtMessage");
		}
	}
}


boidie.prototype.eating = function() {
	this.energy++;
	//console.log("Sleep energy: "+energy);
	if(this.energy > 20) {
		report(this.name + ": Start tweeting");

		var userInfo = keysObj.userInfo();
		var threshold;
		if("threshold" in userInfo) {
			threshold = userInfo.threshold;
		}
		var term = userInfo.interests;
		console.log("Searching for term: " + term);

		tweetr.doSearch(keysObj.userInfo().interests, function(result) {

			tweetr.retweetPopular(result, threshold);
		});

		if(nodejs) {
			actionRef.push({ bid: '-JUPIlRMOl-KiCQXUbRb', type: "tweet", msg: "RT: This is great!", url: "halmrippetoe" });
		}
		this.setState(this.working);
	}
}
boidie.prototype.working = function() {
	this.energy--;
	this.mateEnergy += 0.3;
	//console.log("Work energy: "+this.energy+" Mate energy:"+this.mateEnergy);
	if(this.mateEnergy > 10) {
		report(this.name + ": Start mating");
		this.mateCount = 3;
		this.setState(this.mating);
	} else if(this.energy < 10) {
		report(this.name + ": Start eating");
		this.setState(this.eating);
	}
}
boidie.prototype.sleeping = function() {

}
boidie.prototype.mating = function() {
	this.mateCount--;
	if(this.mateCount < 1) {
		this.mateEnergy = 0.0;
		report(this.name + ": Start eating");
		this.setState(this.eating);
	} else if(this.mateCount == 1) {
		report(this.name + ": Available for mating");
		var male = false;
		var female = false;
		this.create(male, female);
	}

}

randomAllele = function(mother, father, gene) {
	var first, second;
	if(!mother) {
		first = 10*Math.random() > 4 ? 'A' : 'a';
	} else {
		first = 10*Math.random() > 4 ? mother.chromosomes['looks'][gene].substr(0,1) : mother.chromosomes['looks'][gene].substr(1,2);
	}
	if(!father) {
		second = 10*Math.random() > 4 ? 'A' : 'a';
	} else {
		second = 10*Math.random() > 4 ? father.chromosomes['looks'][gene].substr(0,1) : father.chromosomes['looks'][gene].substr(1,2);
	}
	return first + second;
}

getLinuxTime = function() {
	return Math.round((new Date()).getTime() / 1000);
}

boidie.prototype.create = function(db, mother, father) {
	var gender = 10*Math.random() > 4 ? 'm' : 'f';
	var temperature = parseInt(Math.nrand(75, 5));
	var age = getLinuxTime();
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
					NightOwl_EarlyRiser: randomAllele(mother, father, "NightOwl_EarlyRiser"),
					Follower_Trailblazer: randomAllele(mother, father, "Follower_Trailblazer"),
					CurtPoster_VerbosePoster: randomAllele(mother, father, "CurtPoster_VerbosePoster"),
					PreferTweet_PreferRetweet: randomAllele(mother, father, "PreferTweet_PreferRetweet"),
					Comment_NoComment: randomAllele(mother, father, "Comment_NoComment"),
					PreferRetweet: randomAllele(mother, father, "PreferRetweet"),
					PreferTweet: randomAllele(mother, father, "PreferTweet"),
					PreferFollow: randomAllele(mother, father, "PreferFollow"),
					AggressivePoster: randomAllele(mother, father, "AggressivePoster"),
					Commenter: randomAllele(mother, father, "Commenter"),
				},
				speed: {},
				personality: {}
			},
			geneStr: "AaBbCcDd"

		}
	);
	report("Added "+name);
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


module.exports = boidie;

