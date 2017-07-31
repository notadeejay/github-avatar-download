var request = require('request');
var GITHUB_USER = "notadeejay";
var GITHUB_TOKEN = "8475571afba7e2af0eb95296f64a11e3b4e09ba3";
var fs = require('fs');


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors'
  var options = {
    "url": requestURL,
    "method": "GET",
    "headers": {
      'User-Agent': 'GitHub Avatar Download - Student Project'
    }
  };

  request(options, function (err, res, body) {
    var contibutors = JSON.parse(body);
    cb(err, contibutors);
  });
};

function downloadImageByURL(URL, filePath) {
  request.get(URL)
       .on('error', function (err) {                                   // Note 2
         throw err;
       })

       .on('end', function() {
        console.log('Download complete')
       })

       .pipe(fs.createWriteStream(filePath))
}

downloadImageByURL('https://avatars0.githubusercontent.com/u/1615?v=4', 'avatars/jeresig.jpg');



function loopResults(err, result) {
  console.log("Errors:", err);
  for (let contributor of result) {
    return 'https://avatars0.githubusercontent.com/u/' + contributor.id + '?v=4'
  }
}





getRepoContributors("jquery", "jquery", loopResults);
