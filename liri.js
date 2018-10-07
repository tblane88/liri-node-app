require("dotenv").config();
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");
var dotenv = require("dotenv");

var keys = require("./keys.js");
var fs = require("fs");

var operator = process.argv[2];
var info = process.argv[3];

switch(operator) {
    case "concert-this":
        bands(info);
        break;

    case "spotify-this-song":
        spotify(info);
        break;

    case "movie-this":
        omdbMovie(info);
        break;

    case "do-what-it-says":
        readIt();
        break;
    
    default:
        console.log(operator + " is not a valid operator.");
        break;
};


function bands(info) {
    var artist = info;

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
        function(response){
            for(var i = 0; i < response.data.length; i++){
                console.log("------------");
                console.log("Venue Name: " + response.data[i].venue.name);
                console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                console.log("Date: " + moment(response.data[i].datetime).format('MMM-DD-YYYY h:mm A'));
                console.log("------------");


            }
        }
    );


};


function spotify(info) {
    var song = info;
    var spotify = new Spotify(keys.spotify);

    spotify.search({type: 'track', query: song}, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);

        }

        for(var i = 0; i < 10; i++) {
            console.log("------------");
            for(var m = 0; m < data.tracks.items[i].artists.length; m++) {
                console.log("Artist(s): " + data.tracks.items[i].artists[m].name);

            }
            console.log("Song Name: " + data.tracks.items[i].name);
            console.log("Spotify link: " + data.tracks.items[i].external_urls.spotify);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("------------");

        };



    });

};

function omdbMovie(info) {
    var movieName = info;
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    axios.get(queryUrl).then(function(response) {
        // console.log(response.data);
        console.log("------------");
        console.log("Title: " + response.data.Title);
        console.log("Year: " + response.data.Year);
        for(var b = 0; b < response.data.Ratings.length; b++) {
            console.log(response.data.Ratings[b].Source + " Rating: " + response.data.Ratings[b].Value);
        }
        console.log("Country of Origin: " + response.data.Country);
        console.log("Language: " + response.data.Language);
        console.log("Plot: " + response.data.Plot);
        console.log("Actors: " + response.data.Actors);
        console.log("------------");


    })
};

function readIt() {
    var file = process.argv[3];

    fs.readFile(file, "utf8", function(err, data) {
        if(err) {
            return console.log(err);
        };

        var dataArr = data.split(",");
        var choice = dataArr[0];
        info = dataArr[1];

        switch(choice) {
            case "concert-this":
                bands(info);
                break;
        
            case "spotify-this-song":
                spotify(info);
                break;
        
            case "movie-this":
                omdbMovie(info);
                break;
            
            default:
                console.log(choice + " is not a valid operator.");
                break;
        };

    })
}


