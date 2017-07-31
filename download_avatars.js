var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config()


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
    var contibutors = JSON.parse(body);
    cb(err, contibutors);
  });
}

//request to download images using the avatar_url defined in loopResults
function downloadImageByURL(URL, filePath) {
  request.get(URL)
    .on('error', function(err) {
      throw err;
    })

    .on('end', function() {
      console.log('Download complete');
    })

    .pipe(fs.createWriteStream(filePath))
}


//loop through the parsed data set
function loopResults(err, result) {
  for (var contributor of result) {
    downloadImageByURL(contributor.avatar_url, './avatars/' + contributor.login + '.jpg');
  }
}


getRepoContributors(process.argv[2], process.argv[3], loopResults);
