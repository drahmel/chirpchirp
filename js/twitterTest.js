var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var keysAPI = require('./keys.js');
	var utilsAPI = require('./utils.js');
	var utils = new utilsAPI();
	var document = {};
}

var twitterAPI = require('./tweet.js');

var keysObj = new keysAPI();
var boidiesAccounts = keysObj.users();
var num = Math.floor( Math.random() *  boidiesAccounts.length);
var account = boidiesAccounts[num];
if(true) {
	account = 'kathrynsdonnate';
}
var keysObj = new keysAPI(account);

var tweetr = new twitterAPI(account);


var userInfo = keysObj.userInfo();
var threshold;
if("threshold" in userInfo) {
	threshold = userInfo.threshold;
}
var term = userInfo.interests;
console.log("Searching for term: " + term);

tweetr.doSearch(keysObj.userInfo().interests, function(result) {
	setTimeout(function () { process.exit() }, 10000);

	tweetr.retweetPopular(result, threshold);
});
//doPost("The scale doesn't lie.");
//doRetweet('499919536263401473');
//process.exit();

