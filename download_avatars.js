var request = require('request');
var GITHUB_USER = "notadeejay";
var GITHUB_TOKEN = "8475571afba7e2af0eb95296f64a11e3b4e09ba3";



function getRepoContributors(repoOwner, repoName, cb) {

  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';


  request.get(requestURL)
  .on('data', function (chunk) {
      console.log('BODY :' + chunk);
  })


}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});