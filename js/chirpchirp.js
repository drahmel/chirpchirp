// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var document = {};
	var Firebase = require('firebase');
	var fsmAPI = require('./finitestatemachine.js');
	var fsm = new fsmAPI();
	var boidieAPI = require('./boidie.js');
	var boidies = new boidieAPI();
} else {
	var fsmAPI = finitestatemachine;
	var fsm = new finitestatemachine();
	var boidies = new boidie();
}

// TODO: Abstract all into config
// Setup reference to Firebase data source
var dbSource = 'blinding-fire-4882';
var namespace = 'dan_';
var chirpers = "creatures2";
var actions = "actions";

var myDataRef = new Firebase('https://'+dbSource+'.firebaseio.com/');
var creaturesRef = myDataRef.child(namespace + chirpers);
var actionRef = myDataRef.child(actions);
var boidieNum = 0;
var deadBoidies = 0;
var chromosomes = {};
document.totalNum = 0;


// _____________ Functions _____________
function getLinuxTime() {
	return Math.round((new Date()).getTime() / 1000);
}
Math.nrand = function(center, width) {
	var x1, x2, rad, y1;
	do {
		x1 = 2 * Math.random() - 1;
		x2 = 2 * Math.random() - 1;
		rad = x1 * x1 + x2 * x2;
	} while(rad >= 1 || rad == 0);
	var c = this.sqrt(-2 * Math.log(rad) / rad);
	return ((x1 * c) * (width/2)) + center;
};
function showAlert(bid, msg)
{
	$('#'+bid)
		.find('.boidie-msg')
		.html(msg)
		.css('display', 'block');
	t = window.setTimeout("$('#"+bid+"').find('.boidie-msg').fadeOut('slow')", 2000);
}
function report(msg) {
	if(!nodejs) {
		$("#txtMain").html(msg);
	}
}

function idleChirpers() {
	console.log("____Start idle cycle");
	var male = false;
	var female = false;
	if(Object.keys(document.chirpers).length < 2) {
		console.log("No viable chirper population. Seeding new chirpers.");
		for(var i=0;i<10;i++) {
			boidies.create(creaturesRef, male, female);
		}
	}
	for(var i in document.chirpers) {
		document.chirpers[i].update();
	}
}

function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#noids'));
	$('#noids')[0].scrollTop = $('#noids')[0].scrollHeight;
};

function startChirpers() {
	document.chirpers = {};

	setInterval(idleChirpers, 1000);
}


// _____________ Firebase events _____________

creaturesRef.on('child_added', function(snapshot) {
	var imageStr;
	var boid = snapshot.val();
	var age = getLinuxTime() - boid.deathAge;
	document.totalNum++;
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
	var boidiesAccounts = ['MichaelDHyson', 'lynnmbessinger', 'halmrippetoe', 'jilliancmarotz'];
	var boidieTwitter = boidiesAccounts[boidieNum %  boidiesAccounts.length];

	boidieInstance.obj = snapshot.val();
	document.chirpers[snapshot.name()] = boidieInstance;
	var boidiesPerRow = 12;
	var marginTop = 100;
	var row = parseInt(boidieNum / boidiesPerRow);
	var col = boidieNum % boidiesPerRow;
	var ty = (row*128) + marginTop;
	var tx = (col*128);
	boidieNum++;

	//displayChatMessage(message.name, message.birthTime);
	var out = '<div class="boid-row" id="'+snapshot.name()+'" style="top:'+ty+'px;left:'+tx+'px;">';
	out += '<div class="boid-col boid-name"><a href="https://twitter.com/'+boidieTwitter+'" target="_blank">'+boid.name+'</a></div>';
	if(boid.geneStr != undefined) {
		out += '<div class="boidie-genes">'+boid.geneStr+'</div>';
	}
	out += '<div class="boidie-msg" style="display:none;"></div>';
	out += imageStr;
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
	var msg = "<a href='https://twitter.com/" + action.url + "' target='_boidie'>" + action.msg.substr(0,80) + "</a>";
	showAlert(action.bid, msg);
	console.log(action);
});


if(nodejs) {
	startChirpers();
} else {
	$(document).ready(startChirpers);
}

