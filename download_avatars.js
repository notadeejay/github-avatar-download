var request = require('request');
var GITHUB_USER = "notadeejay";
var GITHUB_TOKEN = "8475571afba7e2af0eb95296f64a11e3b4e09ba3";
var fs = require('fs');



function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  var options = {
    "url": requestURL,
    "method": "GET",
    "headers": {
      'User-Agent': 'GitHub Avatar Download - Student Project'
    }
  };

  if (typeof(repoOwner) == 'undefined' || typeof(repoName) == 'undefined') {
    throw new Error('Incorrect input');
  }

  request(options, function(err, res, body) {
    var contibutors = JSON.parse(body);
    cb(err, contibutors);
  });
}


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



function loopResults(err, result) {
  for (var contributor of result) {
    downloadImageByURL(contributor.avatar_url, './avatars/' + contributor.login + '.jpg');
  }
}


getRepoContributors(process.argv[2], process.argv[3], loopResults);