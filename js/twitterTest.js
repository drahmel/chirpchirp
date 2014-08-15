var twitterAPI = require('./tweet.js');

var boidiesAccounts = ['MichaelDHyson', 'lynnmbessinger', 'halmrippetoe', 'jilliancmarotz'];
var num = Math.floor( Math.random() *  boidiesAccounts.length);

var tweetr = new twitterAPI(boidiesAccounts[num]);
var utilsAPI = require('./utils.js');
var utils = new utilsAPI();


//doSearch("fitness since:2014-08-08");
var term = "fitness";
var term = "health fitness";
var term = "gym";

tweetr.doSearch(term, function(result) {
	tweetr.retweetPopular(result);
});
//doPost("The scale doesn't lie.");
//doRetweet('499919536263401473');
//process.exit();

