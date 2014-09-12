var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var url = require('url')
	var keysAPI = require('./keys.js');
	var utilsAPI = require('./utils.js');
	var utils = new utilsAPI();
	var twitterAPI = require('./tweet.js');
	var document = {};
}



var arguments = process.argv.slice(2);

var cmd = "tweet";
if(arguments.length > 0) {
	cmd = arguments[0];
}

var keysObj = new keysAPI();
var boidiesAccounts = keysObj.users();
var num = Math.floor( Math.random() *  boidiesAccounts.length);
var account = boidiesAccounts[num];
if(arguments.length > 1) {
	account = arguments[1];
}

var keysObj = new keysAPI(account);

var tweetr = new twitterAPI(account);

function getStats(accounts, totalFollowers) {
	if(accounts.length == 0) {
		console.log("Done. "+totalFollowers+" total followers.");
		process.exit();
	}
	account = accounts.pop();
	tweetr.doUsers(account, function(out) {
		if(out.success) {
			var data = out['data'];
			//console.log(data);
			totalFollowers += data['followers_count'];
			var msg = data['screen_name'] + "\t" + data['followers_count'] +  "\t" + data['friends_count'] +  "\t" + data['favourites_count'] + "\n";
			console.log(msg);
			fs.appendFile(fname, msg, function (err) {
				if (err) throw err;
			});
		}
		getStats(accounts, totalFollowers);
	});

}
function getMessages(accounts, totalMessages) {
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	if(accounts.length == 0) {
		console.log("Done. "+totalMessages+" total messages.");
		process.exit();
	}
	account = accounts.pop();
	var tweetr = new twitterAPI(account);
	console.log("___________ Checking " + account + " ___________");
	var normalMsg = 0;

	tweetr.checkMessages(function(result) {
		//console.log(result);
		var validation = 0;
		if(result.success == 1) {
			for(var i in result.data) {
				var text = result.data[i].text;
				var postDate = utils.parseTwitterDateStr(result.data[i].created_at);
				var report = false;
				if(postDate > yesterday) {
					report = true;
				}
				if(text.indexOf("TrueTwit validation") != -1) {
					if(report) {
						console.log("VALIDATE: " + result.data[i].created_at + ":" + result.data[i].text);
					}
					validation++;
				} else {
					if(report) {
						console.log(result.data[i].created_at + ":" + result.data[i].text);
					}
					normalMsg++;
				}
			}
			console.log(result.data.length + " messages and " + validation + " requested validations");
			totalMessages++;
		}
		getMessages(accounts, totalMessages);
	});

}

console.log("Running command: " + cmd);
//setTimeout(function () { process.exit() }, 10000);
switch(cmd) {
	case "tweet":
		console.log("Tweeting on account: " + account);
		setTimeout(function () { process.exit() }, 10000);
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
			getStats(boidiesAccounts, 0);
		});

		//process.exit();
		break;
	case "monitor":
		getMessages(boidiesAccounts, 0);
		break;

	case "messages":
		console.log("Checking Messages");
		tweetr.checkMessages(function(result) {

			//console.log(result);
			var validation = 0;
			if(result.success == 1) {
				for(var i in result.data) {
					var text = result.data[i].text;
					if(text.indexOf("TrueTwit validation") != -1) {
						console.log(result.data[i].created_at);
						console.log(result.data[i].text);
						validation++;
					}
				}
				console.log(result.data.length + " messages and " + validation + " requested validations");
			}
			process.exit();
		});

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

