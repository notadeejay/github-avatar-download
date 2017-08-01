var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config()
var mkdirp = require('mkdirp');
var dir = './avatars/';
var args = process.argv.slice(2);



//if the .env file exists, you are good to go!
if (!fs.existsSync('.env')) {
  console.log ('The .env file does not exist')
} else if (!process.env.GITHUB_USER || !process.env.GITHUB_TOKEN) {
  console.log('The .env file is either empty or contains the wrong informations')
}


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + process.env.GITHUB_USER + ':' + process.env.GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  var options = {
    "url": requestURL,
    "method": "GET",
    "headers": {
      'User-Agent': 'GitHub Avatar Download - Student Project'
    }
  };
  //if the user does not provide the right number of inputs, the request will not be made
  if (typeof(repoOwner) == 'undefined' || typeof(repoName) == 'undefined') {
    throw new Error('Incorrect input');
  }
  //initial request for contributor data from GitHub API
  request(options, function(err, res, body) {
    if (!err && res.statusCode == 200) {
    var contributors = JSON.parse(body);
  } else if (res.statusCode == 404) {
    console.log('The repo or owner you are looking for does not exists: ' + res.statusCode)
  } else  if (res.statusCode == 401 ){
    console.log('The credentials are incorrect: ' + res.statusCode)
  }
    cb(err, contributors);
  });

}


 function downloadImageByURL(url, filePath) {
  // create folder
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  request(url).pipe(fs.createWriteStream(filePath)); // download avatar to specified folder
}


//loop through the parsed data set
function loopResults(err, result) {
  for (var contributor of result) {
    downloadImageByURL(contributor.avatar_url, './avatars/' + contributor.login + '.jpg');
  }
}


function checkArgs(args) {
  if (args.length !== 2) {
    console.log('Invalid input, not long enough');
    return;
  }

  var owner = args[0]
  var repo = args[1]

  getRepoContributors(owner, repo, loopResults);
};

console.log('Welcome to the Github Avatar Downloader')
checkArgs(args);


