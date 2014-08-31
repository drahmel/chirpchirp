// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var utils = require('./utils.js');
	//var utils = new utilsAPI();
	var Chirper = require('./chirper.js');
	var Firebase = require('firebase');
	var document = {};

	var dbSource = 'blinding-fire-4882';
	var namespace = 'dan_';
	var chirpers = "creatures3";
	var actions = "actions";

	var myDataRef = new Firebase('https://'+dbSource+'.firebaseio.com/');
	var creaturesRef = myDataRef.child(namespace + chirpers);
}
var cid = "-983984203894029";
ch = new Chirper(cid)
	.cycle();

ch = new Chirper()
	.new()
	.cycle();


ch = new Chirper()
	.mother()
	.father()
	.new()
	.cycle();

function idleChirpers() {
	console.log("____Start idle cycle");
	var male = false;
	var female = false;
	if(Object.keys(document.chirpers).length < 1) {
		console.log("No viable chirper population. Seeding new chirpers.");
		for(var i=0;i<1;i++) {
			console.log("Create chirper");
			var chirper = new Chirper();
			chirper.create(creaturesRef, male, female);
		}
	}
	for(var i in document.chirpers) {
		document.chirpers[i].update();
	}
}

function startChirpers() {
	document.chirpers = {};

	setInterval(idleChirpers, 1000);
}

creaturesRef.on('child_added', function(snapshot) {
	console.log("Add");
});

if(nodejs) {
	console.log("Starting chirpers");
	startChirpers();
} else {
	$(document).ready(startChirpers);
}

