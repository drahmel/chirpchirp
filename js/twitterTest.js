var twitterAPI = require('./tweet.js');
var tweetr = new twitterAPI('DanRahmel');
var utilsAPI = require('./utils.js');
var utils = new utilsAPI();


//doSearch("fitness since:2014-08-08");
tweetr.doSearch("Snapchat", function(result) {
	if(result['success']) {
		var dups = {}
		var alreadyRetweeted = false;
		if(false) {
			console.log(result['data']);
		}
		var statuses = result['data']['statuses'];
		for(var i in statuses) {
			var originalID = 0;
			var status = statuses[i];
			var crc = utils.crc32(status['text']);
			if(crc in dups) {
				console.log("Dup");
			} else {
				dups[crc] = 1;
			}
			console.log(status['id'] + ":" + status['text']);
			if(status['text'].substr(0, 2) == 'RT') {
				//console.log(status['retweeted_status']);
				if('retweeted_status' in status) {
					originalID = status['retweeted_status']['id_str'];
					console.log("...RETWEET of: "+ originalID);
				}
			}
			if(status['favorite_count'] > 0) {
				console.log('...Favorited!!!');
			}
			if(status['retweet_count'] > 0) {
				console.log('Retweeted '+status['retweet_count']+' times!!!');
				if(!alreadyRetweeted && status['retweet_count'] > 20) {
					alreadyRetweeted = true;
					var id = status['id_str'];
					if(originalID) {
						id = originalID;
					}
					console.log("_________________Retweeting: "+id);
					tweetr.retweetsRef.child(id).set({ name: true });

					tweetr.doRetweet(id);

				}
			}
		}
		console.log("Done. _________________");
	}
});
//doPost("The scale doesn't lie.");
//doRetweet('499919536263401473');
//process.exit();

