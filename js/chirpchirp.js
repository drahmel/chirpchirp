// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var Firebase = require('firebase');
	var fsmAPI = require('./fsm.js');
	var boidieAPI = require('./boidie.js');
	var document = {};
	var fsm = new fsmAPI();
	var boidies = new boidieAPI();
} else {
	var fsm = new fsm();
	var boidies = new boidie();
}

var myDataRef = new Firebase('https://blinding-fire-4882.firebaseio.com/');
boidies.document = document;
var user = 'dan_';
var creaturesRef = myDataRef.child(user + "creatures2");
var boidieNum = 0;
var deadBoidies = 0;


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

var chromosomes = {};

function bee() {
	var energy = 20;
	var mateEnergy = 0.0;
	var mateCount = 3;
	var brain;

	this.init = function() {
		brain = new fsmAPI();
		brain.setState(working);
	}
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

function idleBoidies() {
	//console.log("Idle");
	var male = false;
	var female = false;
	if(Object.keys(document.boids).length < 2) {
		//console.log("Create init");
		for(var i=0;i<10;i++) {
			boidies.create(creaturesRef, male, female);
		}
	}
	for(var i in document.boids) {
		if(document.boids[i].gender == 'm') {
			male = i;
		} else {
			female = i;
		}
		if(document.breed && male && female && (100*Math.random() < 5)) {
			boidies.create(creaturesRef, male, female);
			male = false;
			female = false;
		}
	}
	document.bee.update();
}

creaturesRef.on('child_added', function(snapshot) {
	var imageStr;
	var boid = snapshot.val();
	var age = getLinuxTime() - boid.deathAge;
	if(age > 0) {
		if(deadBoidies > 20) {
			return;
		}
		imageStr = '<img src="images/songbird.png" class="dead" style="width:128px;" />';
		var boidieSize = 128;
		deadBoidies++;
		//return;
	} else {
		var totalAge = boid.deathAge-boid.birthTime;
		var curAge = getLinuxTime() - boid.birthTime;
		var agePercent = curAge / totalAge;
		var boidieSize = 64 + (64 * agePercent);
		if(boid.gender == 'm') {
			imageStr = '<img src="images/sunbird.png" style="position:absolute;bottom:0px;width:'+boidieSize+'px;" />';
			//out += "<div class='boid-col gender gender-male'>M</div>";
		} else {
			imageStr = '<img src="images/pidgin.png"  style="position:absolute;bottom:0px;width:'+boidieSize+'px;" />';
			//out += "<div class='boid-col gender gender-female'>F</div>";
		}
	}
	document.boids[snapshot.name()] = snapshot.val();
	var boidiesPerRow = 12;
	var row = parseInt(boidieNum / boidiesPerRow);
	var col = boidieNum % boidiesPerRow;
	console.log(row + " / " + col);
	boidieNum++;

	//displayChatMessage(message.name, message.birthTime);
	var out = '<div class="boid-row" id="'+snapshot.name()+'" style="top:'+(row*128)+'px;left:'+(col*128)+'px;">';
	out += '<div class="boid-col boid-name">'+boid.name+'</div>';
	out += imageStr;
	//out += "<div class='boid-col'>"+parseInt((boid.deathAge-boid.birthTime) / 60)+" minutes</div>";
	//out += "<div class='boid-col'>"+boid.temperature+" &deg;</div>";
	//out += "<div class='boid-col'>"+boid.father+" </div>";
	//out += "<div class='boid-col'>"+boid.mother+"</div>";
	var live = 'alive';
	if(getLinuxTime() > boid.deathAge) {
		live = 'dead';
	}
	//out += "<div class='boid-col "+live+"'>"+"</div>";
	out += '</div><div style="clear:both;"></div>';
	if(!nodejs) {
		$(out).appendTo($('#noids'));
		$("#txtMessage").text($('#noids').children('.boid-row').length + " boids");
	}
});

function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#noids'));
	$('#noids')[0].scrollTop = $('#noids')[0].scrollHeight;
};

//$(document).ready(function() {
	document.boids = {};
	document.bee = new bee();
	document.bee.init();

	setInterval(idleBoidies, 1000);
//});

