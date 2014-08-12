var Bot = require(‘./bot’)
, config1 = require(‘../config1′);

var bot = new Bot(config1);

console.log(‘Chancebot: Running.’);

//get date string for today’s date (e.g. ’2011-01-01′)
function datestring () {
var d = new Date(Date.now() – 6*600*60*1000); //est timezone
return d.getUTCFullYear() + ‘-’
+ (d.getUTCMonth() + 1 ) + ‘-’
+ d.getDate();
};

console.log(datestring());

setInterval(function() {
bot.twit.get(‘followers/ids’, function(err, reply) {
if(err) return handleError(err)
});

var rand = Math.random();

if(rand <= 0.10) { // Chance color

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_color = chance.color();

var params = ‘New Random Web color: ‘ + my_random_color
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}

else if(rand <= .20) { // chance Hashtag

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_hashtag = chance.hashtag();

var params = ‘Lets trend this random Hashtag! ‘ + my_random_hashtag
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}
else if(rand <= .30) { // retweet based on search
var params = {
q: “#geek”
, since: datestring()
, result_type: “mixed”
};

bot.retweet(params, function(err, reply) {
if(err) return handleError(err);
});
}
else if(rand <= .40) { // Chance D20

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_dice = chance.d20();

var params = ‘Just Rolled a D20 and got: ‘ + my_random_dice
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}

else if(rand <= .50) { // prune a follower

bot.prune(function(err, reply) {
if(err) return handleError(err);
var name = reply.screen_name
});
}

else if(rand <= .60) { // follow someone

bot.mingle(function(err, reply) {
if(err) return handleError(err);
var name = reply.screen_name;
});
}

else if(rand <= .70) { // Chance Twitter

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_tweeter = chance.twitter();

var params = ‘Random Twitter handle I thought of ‘ + my_random_tweeter
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}

else if(rand <= .80) { // Chance Domain

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_domain = chance.domain();

var params = ‘Random domain Name I thought of ‘ + my_random_domain
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}

else if(rand <= .90) { // Chance Phone

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_phone = chance.phone();

var params = ‘is this a real number? ‘ + my_random_phone
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}

else { // Chance zipcode

// Instantiate Chance so it can be used
var chance = new Chance();
var my_random_zipcode = chance.zip();

var params = ‘Random zipcode! ‘ + my_random_zipcode
bot.tweet(params, function(err, reply) {
if(err) return handleError(err);
});
}
}, 187523);

function handleError(err) {
console.error(‘response status:’, err.statusCode);
console.error(‘data:’, err.data);
}
