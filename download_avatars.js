var request = require('request');
var GITHUB_USER = "notadeejay";
var GITHUB_TOKEN = "8475571afba7e2af0eb95296f64a11e3b4e09ba3";



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


function loopResults(err, result) {
  console.log("Errors:", err);
  for (let contributor of result) {
    console.log('https://avatars0.githubusercontent.com/u/' + contributor.id + '?v=4')
  }
}



getRepoContributors("jquery", "jquery", loopResults);
