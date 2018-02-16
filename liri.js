//DEPENDENCIES
//npm package for spotify.
var Spotify = require('node-spotify-api'); 
var keys = require("dotenv").config(); 
//Twitter keys and access tokens.
var Twitter = require("twitter"); 
var request = require('request'); 
//NPM package for reading and writing files
var fs = require('fs'); 

// Authentication for Twitter using keys in env folder
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// Authentication for Spotify using .env folder
var spotify = new Spotify({
	id: process.env.SPOTIFY_ID,
	secret: process.env.SPOTIFY_SECRET
});

//Declare the Variables
var arg =  process.argv[2];
var data = '';

if(process.argv[3]){
	for(var i = 3; i < process.argv.length; i++){
		data += process.argv[i] + " ";
	}
}

executeCommand(arg, data);

function executeCommand(arg, data){
	switch(arg){
		case 'my-tweets':
			myTweets(arg);
			break;
		case 'spotify-this-song':
			spotifyThis(arg, data);
			break;
		case 'movie-this':
			movie(arg, data);
			break;
		case 'do-what-it-says':
			doSomething(arg);
			break;
		default:
			console.log('Invalid command');
	}
}


function recordCmd(arg){
	fs.appendFile("log.txt", arg + "/n", function(err){
		if(err){
			console.log('Error occurred: ' + err);
		}
	});
}

function recordCmd(arg, data){
	fs.appendFile("log.txt", arg + " " + data + "/n", function(err){
		if(err){
			console.log('Error occurred: ' + err);
		}
	});
}



function myTweets(arg){
	 console.log("@anytaAli Last 20 tweets:\n");
		  // Send a get request to grab the last 20 tweets from the indicated user's
		  // timeline
		  client.get(
		    'statuses/user_timeline',
		    {
		      screen_name: 'Anyta Ali',
		      count: 20
		    },
		    function(error, tweets, response) {
		      if (error) {
		        console.log(error);
		      } else {
		        // For all of the tweets that are in the response...
		        for (var i = 0; i < tweets.length; i++) {
		          // Log the tweet text to the console
		          console.log(i + 1 + '.' + tweets[i].text);

		          // Log the time that the tweet was created
		          console.log('Created at: ' + tweets[i].created_at + '\n');
		        }
		      }
		      // console.log(JSON.stringify(tweets, null, 2));
		    } // If the command is 'spotify this song'...
		  );
		};


function spotifyThis(arg, data){
	var song = data;

	if(song == ""){
		song = 'White America';
	} 

	spotify.search({ type: 'track', query: song }, function(err, data) {
  	if (err) {
    	console.log('Error occurred: ' + err);
  	}
 
		var results = data.tracks.items;
		results.forEach(function(item){
			if(item.name.toLowerCase() == song.toLowerCase()){
				console.log(item.artists[0].name);
				console.log(item.name);
				console.log(item.preview_url);
				console.log(item.album.name);
			}
		}) 
	});

	recordCmd(arg, song);
}

function movie(arg, data){
	var movie = data;

	if(movie == ""){
		movie = 'Mr. Nobody';
	}

	request('http://www.omdbapi.com/?apikey=trilogy&t=' + movie, function(err, response, body){
		var body = JSON.parse(body);

		console.log("Title: " + body.Title);
		console.log("Year: " + body.Year);
		console.log("IMDB Rating: " + body.Ratings[0].Value);
		console.log("RT Rating: " + body.Ratings[1].Value);
		console.log("Country: " + body.Country);
		console.log("Language: " + body.Language);
		console.log("Plot: " + body.Plot);
		console.log("Actors:" + body.Actors);
	});

	recordCmd(arg, movie);
}


function doSomething(arg){
	fs.readFile("random.txt", "utf8", function(err, data){
		if(err){
			console.log('Error occurred: ' + err);
		}

		var commands = data.split(",");
		executeCommand(commands[0], commands[1]);
	});

	recordCmd(arg);
}