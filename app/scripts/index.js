var $ = require('jquery');
var _ = require('underscore');
var handlebars = require('handlebars');
var moment = require('moment');
var githubtoken = require('./githubtoken.js').token;


if(typeof(githubtoken) !== "undfined"){
  $.ajaxSetup({
    headers: {
      'Authorization': 'token ' + githubtoken,
    }
  });
}

var myUser = 'gabepages';
var userUrl = 'https://api.github.com/users/' + myUser;
var userRepoUrl = 'https://api.github.com/users/' + myUser + '/repos';

$.getJSON(userUrl,function(data){
  console.log(data);

  data.created_at = datePicker(data);

//***********************
//filling template
//***********************
  var source = $('#side-bar-content').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource(data);
  $('.side-col').html(compiled);

  var source = $('#profile-pic').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource(data);
  $('.profile-pic').html(compiled);



});

$.getJSON(userRepoUrl,function(data){
  console.log(data);
  data = orderedData(data);
  var source = $('#repo').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource({'repo': data});
  $('.repo').html(compiled);
});


function orderedData(data){
 data =  _.sortBy(data, function(data){
    return data.pushed_at;
  });
data = data.reverse();
data = _.map(data,function(data){
var updateAgo = new Date(data.pushed_at);
data.pushed_at = moment(updateAgo).startOf('minute').fromNow();
return data
});
return data;
}

function datePicker(data){
  var date =new Date ($(data.created_at).selector);
  var shortMonth =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec']
  var month = shortMonth[date.getMonth()];
  var day = date.getDate();
  var year = date.getYear() + 1900;
  var newDate = month + " " + day + " " + year;
  return newDate;
}
