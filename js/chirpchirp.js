// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var Firebase = require('firebase');
	var fsmAPI = require('./finitestatemachine.js');
	var boidieAPI = require('./boidie.js');
	var document = {};
	var fsm = new fsmAPI();
	var boidies = new boidieAPI();
} else {
	var fsmAPI = finitestatemachine;
	var fsm = new finitestatemachine();
	var boidies = new boidie();
}

var myDataRef = new Firebase('https://blinding-fire-4882.firebaseio.com/');
var user = 'dan_';
var creaturesRef = myDataRef.child(user + "creatures2");
var actionRef = myDataRef.child(user + "actions");
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
function showAlert(bid, msg)
{
	//bid = '-JUOw-EXpPi2lTV6Vva-';
	$('#'+bid)
		.find('.boidie-msg')
		.text(msg.substr(0,80))
		.css('display', 'block');
	t = window.setTimeout("$('#"+bid+"').find('.boidie-msg').fadeOut('slow')", 2000);
}


var chromosomes = {};


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
		document.boids[i].update();
		/*
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
		*/
	}
	//document.bee.update();
}

creaturesRef.on('child_added', function(snapshot) {
	var imageStr;
	var boid = snapshot.val();
	var age = getLinuxTime() - boid.deathAge;
	if(age > 0) {
		if(deadBoidies > 10) {
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
	var boidieInstance = new boidie(snapshot.name());

	boidieInstance.obj = snapshot.val();
	document.boids[snapshot.name()] = boidieInstance;
	var boidiesPerRow = 12;
	var marginTop = 0;
	var row = parseInt(boidieNum / boidiesPerRow);
	var col = boidieNum % boidiesPerRow;
	//console.log(row + " / " + col);
	var ty = (row*128) + marginTop;
	var tx = (col*128);
	boidieNum++;

	//displayChatMessage(message.name, message.birthTime);
	var out = '<div class="boid-row" id="'+snapshot.name()+'" style="top:'+ty+'px;left:'+tx+'px;">';
	out += '<div class="boid-col boid-name">'+boid.name+'</div>';
	out += '<div class="boidie-msg" style="display:none;">Hello h jh bjh bjhb jhbjh b jh bjh bj hb bjhb hj</div>';
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
actionRef.on('child_added', function(snapshot) {
	var action = snapshot.val();
	console.log(action);
});

function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#noids'));
	$('#noids')[0].scrollTop = $('#noids')[0].scrollHeight;
};

//$(document).ready(function() {
	document.boids = {};

	setInterval(idleBoidies, 10000);
//});

