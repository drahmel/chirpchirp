// Check if running as Node
var nodejs = false;
if (typeof window === 'undefined') {
	nodejs = true;
	var Firebase = require('firebase');
	var twitterAPI = require('node-twitter-api');
	var keysAPI = require('./keys.js');
	var utilsAPI = require('./utils.js');
	var utils = new utilsAPI();
	var document = {};
}

function tweet(boidieName) {
	this.boidieName = boidieName;
	var myDataRef = new Firebase('https://blinding-fire-4882.firebaseio.com/');
	this.retweetsRef = myDataRef.child("retweets");
	this.actionRef = myDataRef.child("actions");

	this.keys = new keysAPI(boidieName);

	this.twitter = new twitterAPI({
		consumerKey: this.keys.twitterKey,
		consumerSecret: this.keys.twitterSecret,
		callback: 'http://local.twitter.com/'
	});
}

// Doesn't work
tweet.prototype.doGetToken = function() {
	this.twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
	    if (error) {
		console.log("Error getting OAuth request token : ");
		console.log(error);
	    } else {
		//store token and tokenSecret somewhere, you'll need them later; redirect user
		console.log(error);
		console.log(requestToken);
		console.log(requestTokenSecret);
		console.log(results);
		doSearch("fitness since:2014-08-08", handleSearchResults);
		this.twitter.getAccessToken(requestToken, requestTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
		    if (error) {
			console.log(error);
		    } else {
			keys.accessToken = requestToken;
			keys.accessTokenSecret = requestTokenSecret;
			//store accessToken and accessTokenSecret somewhere (associated to the user)
			//Step 4: Verify Credentials belongs here
			console.log(results);
			doSearch("fitness since:2014-08-08", handleSearchResults);
		    }
		});
	    }
	});
}

tweet.prototype.doPost = function(msg) {
	this.twitter.statuses("update", {
		status: msg
	    },
	    keys.accessToken,
	    keys.accessTokenSecret,
	    function(error, data, response) {
		if (error) {
			console.log(error);
		    // something went wrong
		} else {
		    // data contains the data sent by twitter
		    console.log("Success!");
		    console.log(data);
		}
	    }
	);
}

tweet.prototype.doRetweet = function(id, callback) {
	this.twitter.statuses("retweet", {
		id: id
	    },
	    this.keys.accessToken,
	    this.keys.accessTokenSecret,
	    function(error, data, response) {
		if (error) {
			console.log("Retweet Error!!!"+id);
			console.log(error);
		    // something went wrong
		} else {
		    // data contains the data sent by twitter
		    console.log("Retweet Success!"+id);
		    console.log(data);
		}
	    }
	);
}
tweet.prototype.doFollow = function(id, callback) {
	this.twitter.friendships("create", {
		user_id: id
	    },
	    this.keys.accessToken,
	    this.keys.accessTokenSecret,
	    function(error, data, response) {
		if (error) {
			console.log("Follow Error!!!"+id);
			console.log(error);
		    // something went wrong
		} else {
		    // data contains the data sent by twitter
		    console.log("Follow Success!"+id);
		    console.log(data);
		}
	    }
	);
}

//nytimes
tweet.prototype.doSearch = function(term, callback) {
	var out = {success:0, msg:''};
	this.twitter.search({
		q: term,
		count: 100,
		lang: 'en',
	    },
	    this.keys.accessToken,
	    this.keys.accessTokenSecret,
	    function(error, data, response) {
		if (error) {
			console.log(error);
			out['msg'] = error;
		    // something went wrong
		} else {
		    // data contains the data sent by twitter
		    //console.log("Success!");
		    //console.log(data);
		    out['success'] = 1;
		    out['data'] = data;
		}
		callback(out);
	    }
	);
}

tweet.prototype.handleSearchResults = function(result) {
	if(result['success']) {
		var dups = {}
		var alreadyRetweeted = false;
		var threshold = 20;
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
			var popularity = status['favorite_count'] + status['retweet_count'];
			if(status['favorite_count'] > 0) {
				console.log('...Favorited!!!');
			}
			if(status['retweet_count'] > 0) {
				console.log('Retweeted '+status['retweet_count']+' times!!!');
				if(!alreadyRetweeted && popularity > threshold) {
					if(status['text'].toLowerCase().indexOf('nigga') != -1) {
						continue;
					}

					alreadyRetweeted = true;
					var id = status['id_str'];
					if(originalID) {
						id = originalID;
					}
					console.log("_________________Retweeting: "+id);
					tweetr.retweetsRef.child(id).set({ name: boidieName });

					tweetr.doRetweet(id);

				}
			}
		}
		console.log("Done. _________________");
	}
};

tweet.prototype.retweetPopular = function(result, threshold) {
	if(threshold == undefined) {
		threshold = 20;
	} else {
		console.log("Custom threshold: " + threshold);
	}
	if(result['success']) {
		var dups = {}
		var alreadyRetweeted = false;
		if(false) {
			console.log(result['data']);
		}
		var statuses = result['data']['statuses'];
		for(var i in statuses) {
			console.log("____________________________________________");
			var originalID = 0;
			var status = statuses[i];
			var crc = utils.crc32(status['text']);
			if(crc in dups) {
				console.log("Dup: " + status['text']);
				continue;
			} else {
				dups[crc] = 1;
			}
			console.log(status['id'] + ":" + status['text']);
			if(status['text'].substr(0, 2) == 'RT') {
				if('retweeted_status' in status) {
					originalID = status['retweeted_status']['id_str'];
					console.log("...RETWEET of: "+ originalID);
				}
			}
			var popularity = status['favorite_count'] + status['retweet_count'];
			if(status['favorite_count'] > 0) {
				console.log('...Favorited!!!');
			}
			if(status['retweet_count'] > 0) {
				console.log('Retweeted '+status['retweet_count']+' times!!!');
				if(!alreadyRetweeted && popularity > threshold) {
					if(status['text'].toLowerCase().indexOf('nigga') != -1) {
						continue;
					}
					alreadyRetweeted = true;
					var id = status['id_str'];
					if(originalID) {
						id = originalID;
					}
					console.log("_________________Retweeting: "+id);
					this.retweetsRef.child(id).set({ name: true });
					this.actionRef.push({ bid: '-JUPIlRMOl-KiCQXUbRb', type: "tweet", msg: status['text'], url: "halmrippetoe" });

					var followTweeter = Math.floor( Math.random() * 2);
					console.log("Follow tweeter: " + followTweeter);
					if(followTweeter) {
						this.doFollow(status['user']['id_str']);
					} else {
						this.doRetweet(id);
					}

				}
			}
		}
		console.log("Done. _________________");
	}
};

module.exports = tweet;


