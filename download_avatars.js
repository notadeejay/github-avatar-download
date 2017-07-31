var request = require('request');
var fs = require('fs');
var dotenv = require('dotenv').config()
var mkdirp = require('mkdirp');
var getPath = require('path').dirname
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
  } else if (res.statusCode == 400) {
    console.log('The item you are looking for does not exists')
  } else {
    console.log('Error: ' + res.statusCode)
  }
    cb(err, contributors);
  });

}

//request to download images using the avatar_url defined in loopResults
function downloadImageByURL(URL, filePath) {

 //creates a directory if there is not already one created
  mkdirp(getPath(filePath), function (err) {
    if (err) throw err;

    request.get(URL)
      .on('error', function (err) {
        throw err;
      })
      .on('response', function (response) {
        console.log('Download complete')
      })
      .pipe(fs.createWriteStream(filePath));

  });

};


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

checkArgs(args);
