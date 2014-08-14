// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var Firebase = require('firebase');
	var document = {};
}

var myDataRef = new Firebase('https://blinding-fire-4882.firebaseio.com/');
var user = 'dan_';
var creaturesRef = myDataRef.child(user + "creatures2");

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

/*
Possible Genes (Dominant_Recessive):
	NightOwl_EarlyRiser
	Follower_Trailblazer
	CurtPoster_VerbosePoster
	PreferTweet_PreferRetweet
	Comment_NoComment
*/

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
var boidieNum = 0;
var deadBoidies = 0;

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

	setInterval(idleBoids, 1000);
//});


	(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x]+
			  'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = function(callback, element) {
				var currTime = new Date().getTime();
				var timeToCall = Math.max(0, 16 - (currTime - lastTime));
				var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				  timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};

		if (!window.cancelAnimationFrame)
			window.cancelAnimationFrame = function(id) {
				clearTimeout(id);
			};
	}())

	var layers = [],
		objects = [],

		world = document.getElementById( 'world' ),
		viewport = document.getElementById( 'viewport' ),

		d = 0,
		p = 400,
		worldXAngle = 0,
		worldYAngle = 0;

	viewport.style.webkitPerspective = p;
	viewport.style.MozPerspective = p;
	viewport.style.oPerspective = p;

	generate();

	function createCloud() {

		var div = document.createElement( 'div'  );
		div.className = 'cloudBase';
		var x = 256 - ( Math.random() * 512 );
		var y = 256 - ( Math.random() * 512 );
		var z = 256 - ( Math.random() * 512 );
		var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';
		div.style.webkitTransform = t;
		div.style.MozTransform = t;
		div.style.oTransform = t;
		world.appendChild( div );

		for( var j = 0; j < 5 + Math.round( Math.random() * 10 ); j++ ) {
			var cloud = document.createElement( 'img' );
			cloud.style.opacity = 0;
			var r = Math.random();
			var src = 'cloud.png';
			( function( img ) { img.addEventListener( 'load', function() {
				img.style.opacity = .8;
			} ) } )( cloud );
			cloud.setAttribute( 'src', src );
			cloud.className = 'cloudLayer';

			var x = 256 - ( Math.random() * 512 );
			var y = 256 - ( Math.random() * 512 );
			var z = 100 - ( Math.random() * 200 );
			var a = Math.random() * 360;
			var s = .25 + Math.random();
			x *= .2; y *= .2;
			cloud.data = {
				x: x,
				y: y,
				z: z,
				a: a,
				s: s,
				speed: .1 * Math.random()
			};
			var t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
			cloud.style.webkitTransform = t;
			cloud.style.MozTransform = t;
			cloud.style.oTransform = t;

			div.appendChild( cloud );
			layers.push( cloud );
		}

		return div;
	}

	window.addEventListener( 'mousewheel', onContainerMouseWheel );
	window.addEventListener( 'DOMMouseScroll', onContainerMouseWheel );

	window.addEventListener( 'mousemove', function( e ) {
		worldYAngle = -( .5 - ( e.clientX / window.innerWidth ) ) * 180;
		worldXAngle = ( .5 - ( e.clientY / window.innerHeight ) ) * 180;
		updateView();
	} );

	function generate() {
		objects = [];
		if ( world.hasChildNodes() ) {
			while ( world.childNodes.length >= 1 ) {
				world.removeChild( world.firstChild );
			}
		}
		for( var j = 0; j < 5; j++ ) {
			objects.push( createCloud() );
		}
	}

	function updateView() {
		var t = 'translateZ( ' + d + 'px ) rotateX( ' + worldXAngle + 'deg) rotateY( ' + worldYAngle + 'deg)';
		world.style.webkitTransform = t;
		world.style.MozTransform = t;
		world.style.oTransform = t;
	}
/*
	function onContainerMouseWheel( event ) {

		event = event ? event : window.event;
		d = d - ( event.detail ? event.detail * -5 : event.wheelDelta / 8 );
		updateView();

	}
*/
	function update (){

		for( var j = 0; j < layers.length; j++ ) {
			var layer = layers[ j ];
			layer.data.a += layer.data.speed;
			var t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + ( - worldYAngle ) + 'deg ) rotateX( ' + ( - worldXAngle ) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
			layer.style.webkitTransform = t;
			layer.style.MozTransform = t;
			layer.style.oTransform = t;
		}

		requestAnimationFrame( update );

	}

	//update();

