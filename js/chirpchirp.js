var Firebase = require('firebase');


var chromosomes = {};

function fsm() {
	var activeState = undefined;

	this.setState = function(state) {
		activeState = state;
	};
	this.update = function(state) {
		if(activeState != undefined) {
			activeState();
		}
	};
}
function bee() {
	var energy = 20;
	var mateEnergy = 0.0;
	var mateCount = 3;
	var brain;

	var eating = function() {
		energy++;
		//console.log("Sleep energy: "+energy);
		if(energy > 20) {
			console.log("Start working");
			brain.setState(working);
		}
	}
	var working = function() {
		energy--;
		mateEnergy += 0.3;
		//console.log("Work energy: "+energy+" Mate energy:"+mateEnergy);
		if(mateEnergy > 10) {
			console.log("Start mating");
			mateCount = 3;
			brain.setState(mating);
		} else if(energy < 10) {
			console.log("Start eating");
			brain.setState(eating);
		}
	}

	this.sleeping = function() {

	}
	mating = function() {
		mateCount--;
		if(mateCount < 1) {
			mateEnergy = 0.0;
			console.log("Start eating");
			brain.setState(eating);
		} else if(mateCount == 1) {
			console.log("Creating boid");
			var male = false;
			var female = false;
			createBoid(male, female);
		}

	}
	this.update = function() {
		brain.update();
	}
	this.init = function() {


		brain = new fsm();
		brain.setState(working);
	}


}


function ant() {
	this.position = {x:0, y:0};
	this.lead = {x:100, y:200};
	this.velocity = [-1, -1];
	this.brain = new fsm();

	this.findLeaf = function(state) {
		console.log("findLeaf");
		// Move the ant towards the leaf.
		var velocityx = this.leaf.x - this.position.x;
		var velocityy = this.leaf.y - this.position.y;

		if (distance(Game.instance.leaf, this) <= 10) {
			// The ant is extremelly close to the leaf, it's time
			// to go home.
			this.brain.setState(goHome);
		}

		if (distance(Game.mouse, this) <= MOUSE_THREAT_RADIUS) {
			// Mouse cursor is threatening us. Let's run away!
			// It will make the brain start calling runAway() from
			// now on.
			this.brain.setState(runAway);
		}
	};
	this.goHome = function(state) {
	};
	this.runAway = function(state) {
	};
	this.update = function(state) {
		this.brain.update();
		this.moveBasedOnVelocity();
	};

	// Initialize
	this.brain.setState(this.findLeaf);
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

function getLinuxTime() {
	return Math.round((new Date()).getTime() / 1000);
}
Math.nrand = function(center, width) {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * this.random() - 1;
		x2 = 2 * this.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = this.sqrt(-2 * Math.log(rad) / rad);
	return ((x1 * c) * (width/2)) + center;
};
var myDataRef = new Firebase('https://blinding-fire-4882.firebaseio.com/');
var creaturesRef = myDataRef.child("creatures2");
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
function createBoid(mother, father) {
	var gender = 10*Math.random() > 4 ? 'm' : 'f';
	var temperature = parseInt(Math.nrand(75, 5));
	var age = getLinuxTime();
	var deathAge = age + parseInt(3600*Math.random());
	var name = (gender=='m') ? "Sam"+temperature : "Pam"+temperature;
	creaturesRef.push(
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
function idleBoids() {
	//console.log("Idle");
	var male = false;
	var female = false;
	if(Object.keys(document.boids).length < 2) {
		//console.log("Create init");
		for(var i=0;i<10;i++) {
			createBoid(male, female);
		}
	}
	for(var i in document.boids) {
		if(document.boids[i].gender == 'm') {
			male = i;
		} else {
			female = i;
		}
		if(document.breed && male && female && (100*Math.random() < 5)) {
			createBoid(male, female);
			male = false;
			female = false;
		}
	}
	document.bee.update();
}

creaturesRef.on('child_added', function(snapshot) {
	var boid = snapshot.val();
	if(getLinuxTime() > boid.deathAge) {
		return;
	}
	document.boids[snapshot.name()] = snapshot.val();

	//displayChatMessage(message.name, message.birthTime);
	var out = '<div class="boid-row" id="'+snapshot.name()+'">';
	out += '<div class="boid-col boid-name">'+boid.name+'</div>';
	if(boid.gender == 'm') {
		out += "<div class='boid-col gender gender-male'>M</div>";
	} else {
		out += "<div class='boid-col gender gender-female'>F</div>";
	}
	out += "<div class='boid-col'>"+parseInt((boid.deathAge-boid.birthTime) / 60)+" minutes</div>";
	out += "<div class='boid-col'>"+boid.temperature+" &deg;</div>";
	out += "<div class='boid-col'>"+boid.father+" </div>";
	out += "<div class='boid-col'>"+boid.mother+"</div>";
	var live = 'alive';
	if(getLinuxTime() > boid.deathAge) {
		live = 'dead';
	}
	out += "<div class='boid-col "+live+"'>"+"</div>";
	out += '</div><div style="clear:both;"></div>';
	/*
		$(out).appendTo($('#noids'));
		$("#txtMessage").text($('#noids').children('.boid-row').length + " boids");
	*/
});
function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#noids'));
	$('#noids')[0].scrollTop = $('#noids')[0].scrollHeight;
};

var document = {};
//$(document).ready(function() {
	document.boids = {};
	document.bee = new bee();
	document.bee.init();

	setInterval(idleBoids, 1000);
//});

