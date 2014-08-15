var twitterAPI = require('./tweet.js');
var tweetr = new twitterAPI('MichaelDHyson');
var utilsAPI = require('./utils.js');
var utils = new utilsAPI();


//doSearch("fitness since:2014-08-08");
tweetr.doSearch("fitness", function(result) {
	tweetr.retweetPopular(result);
});
//doPost("The scale doesn't lie.");
//doRetweet('499919536263401473');
//process.exit();

