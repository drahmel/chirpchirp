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
if(false) {
	account = 'kathrynsdonnate';
}
var keysObj = new keysAPI(account);

var tweetr = new twitterAPI(account);

var arguments = process.argv.slice(2);

var cmd = "tweet";
if(arguments.length > 0) {
	cmd = arguments[0];
}
console.log("Running command: " + cmd);
setTimeout(function () { process.exit() }, 10000);
switch(cmd) {
	case "tweet":
		var userInfo = keysObj.userInfo();
		var threshold;
		if("threshold" in userInfo) {
			threshold = userInfo.threshold;
		}
		var term = userInfo.interests;
		console.log("Searching for term: " + term);

		tweetr.doSearch(keysObj.userInfo().interests, function(result) {

			tweetr.retweetPopular(result, threshold);
		});
		break;
	case "stats":
		var fs = require('fs');
		console.log("User stats");
		var date = new Date();
		var dateStr = "" + date.getFullYear()+(date.getMonth() + 1) + date.getDate();
		var fname = "/data/chirpers_" + dateStr + ".log";
		fs.writeFile(fname, "name\tfollowers\tfollowing\tfavorites\n", function (err) {
			for(var i in boidiesAccounts) {
				tweetr.doUsers(boidiesAccounts[i], function(out) {
					if(out.success) {
						var data = out['data'];
						//console.log(data);
						var msg = data['screen_name'] + "\t" + data['followers_count'] +  "\t" + data['friends_count'] +  "\t" + data['favourites_count'] + "\n";
						console.log(msg);
						fs.appendFile(fname, msg, function (err) {
							if (err) throw err;
							console.log('The "data to append" was appended to file!');
						});
					}
				});
			}
		});

		//process.exit();
		break;
	case "post":
		console.log("Post");
		doPost("The scale doesn't lie.");
		break;
	case "retweet":
		console.log("retweet");
		doRetweet('499919536263401473');
		break;
}
//

