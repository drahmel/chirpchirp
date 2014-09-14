// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var document = {};
	var Utils = require('./utils.js');
	var utils = new Utils();
	var Firebase = require('firebase');
	var fsmAPI = require('./finitestatemachine.js');
	var fsm = new fsmAPI();
	var Chirper = require('./chirper.js');
	var chirper = new Chirper();
} else {
	var fsmAPI = finitestatemachine;
	var fsm = new finitestatemachine();
	var chirpers = new chirper();
}

// TODO: Abstract all into config
// Setup reference to Firebase data source
var dbSource = 'blinding-fire-4882';
var namespace = 'dan_';
var chirpers = "creatures3";
var actions = "actions";

var myDataRef = new Firebase('https://'+dbSource+'.firebaseio.com/');
var creaturesRef = myDataRef.child(namespace + chirpers);
var actionRef = myDataRef.child(actions);
var chirperNum = 0;
var deadChirpers = 0;
var chromosomes = {};
document.totalNum = 0;


// _____________ Functions _____________
function showAlert(bid, msg)
{
	if(nodejs) {
		console.log(msg);
	} else {
		$('#'+bid)
			.find('.chirper-msg')
			.html(msg)
			.css('display', 'block');
		t = window.setTimeout("$('#"+bid+"').find('.chirper-msg').fadeOut('slow')", 2000);
	}
}
function report(msg) {
	if(!nodejs) {
		$("#txtMain").html(msg);
	}
}

function idleChirpers() {
	var ic = document.idleCycle || 0;
	ic++;
	document.idleCycle = ic;
	console.log("____Perform idle cycle #"+ic);
	var male = false;
	var female = false;
	if(Object.keys(document.chirpers).length < 2) {
		console.log("No viable chirper population. Seeding new chirpers.");
		for(var i=0;i<10;i++) {
			chirper.create(creaturesRef, male, female);
		}
	}
	for(var i in document.chirpers) {
		document.chirpers[i].cycle();
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
		if(deadChirpers > 10) {
			return;
		}
		imageStr = '<img src="images/songbird.png" class="dead" style="width:128px;" />';
		var chirperSize = 128;
		deadChirpers++;
		//return;
	} else {
		var totalAge = boid.deathAge-boid.birthTime;
		var curAge = utils.getLinuxTime() - boid.birthTime;
		var agePercent = curAge / totalAge;
		var chirperSize = 64 + (64 * agePercent);
		if(boid.gender == 'm') {
			imageStr = '<img src="images/sunbird.png" style="position:absolute;bottom:0px;width:'+chirperSize+'px;" />';
			//out += "<div class='boid-col gender gender-male'>M</div>";
		} else {
			imageStr = '<img src="images/pidgin.png"  style="position:absolute;bottom:0px;width:'+chirperSize+'px;" />';
			//out += "<div class='boid-col gender gender-female'>F</div>";
		}
	}
	var chirperInstance = new Chirper(snapshot.name());
	var chirpersAccounts = ['MichaelDHyson', 'lynnmbessinger', 'halmrippetoe', 'jilliancmarotz'];
	var chirperTwitter = chirpersAccounts[chirperNum %  chirpersAccounts.length];

	chirperInstance.obj = snapshot.val();
	document.chirpers[snapshot.name()] = chirperInstance;
	var chirpersPerRow = 12;
	var marginTop = 100;
	var row = parseInt(chirperNum / chirpersPerRow);
	var col = chirperNum % chirpersPerRow;
	var ty = (row*128) + marginTop;
	var tx = (col*128);
	chirperNum++;

	//displayChatMessage(message.name, message.birthTime);
	if(!nodejs) {
		var out = '<div class="boid-row" id="'+snapshot.name()+'" style="top:'+ty+'px;left:'+tx+'px;">';
		out += '<div class="boid-col boid-name"><a href="https://twitter.com/'+chirperTwitter+'" target="_blank">'+boid.name+'</a></div>';
		if(boid.geneStr != undefined) {
			out += '<div class="chirper-genes">'+boid.geneStr+'</div>';
		}
		out += '<div class="chirper-msg" style="display:none;"></div>';
		out += imageStr;
		var live = 'alive';
		if(getLinuxTime() > boid.deathAge) {
			live = 'dead';
		}
	//out += "<div class='boid-col "+live+"'>"+"</div>";
		out += '</div><div style="clear:both;"></div>';
		$(out).appendTo($('#noids'));
		$("#txtMessage").text($('#noids').children('.boid-row').length + " boids");
	}
});

actionRef.on('child_added', function(snapshot) {
	if(false) {
		var action = snapshot.val();
		var msg = "<a href='https://twitter.com/" + action.url + "' target='_chirper'>" + action.msg.substr(0,80) + "</a>";
		showAlert(action.bid, msg);
		console.log(action);
	}
});


if(nodejs) {
	startChirpers();
} else {
	$(document).ready(startChirpers);
}

