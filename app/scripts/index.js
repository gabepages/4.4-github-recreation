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
var userOrgUrl = 'https://api.github.com/users/' + myUser + '/orgs';


$.getJSON(userUrl,function(data){
  console.log(data);

  data.created_at = datePicker(data);
  accountTemplate(data);
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
  sortPublic(data);
  sortPrivate(data);
  sortSources(data);
  sortForks(data);
  repoTemplate(data);
  searchRepo(data);
});

$.getJSON(userOrgUrl,function(data){
  console.log(data);
  var source = $('#orgs').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource(data);
  $('.orgs').html(compiled);
  // orgsList(data);
});
// function orgsList(data){
//
// }

function searchRepo(data){
  $('#search-but').on('click', function(event){
    var searchPhrase = $('.search-repo').val().toLowerCase();
  var searchResults = _.filter(data, function(repo){
      var name = repo.name.indexOf(searchPhrase) != -1;
      var lang = repo.language.toLowerCase();
      if (name || lang == searchPhrase){
        return true;
      }else {
        return false;
      }
    });
    repoTemplate(searchResults);
  });
}

function sortPublic(data){

  $('#public').on('click',function(event){
    if($(this).hasClass('active')){
    }else{
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
    }
    var newRepo =  _.filter(data, function(repo){
      if(repo.private == false){
        return true;
      }else{
        return false;
      }
    });

    console.log(newRepo);
    repoTemplate(newRepo);

  });
}

function sortPrivate(data){
  $('#private').on('click',function(data){
    if($(this).hasClass('active')){
  }else{
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
  }
   var newRepo =  _.filter(data.private, function(data){
      if(data.private == true){
        return true;
      }else{
        return false;
      }
    });
  console.log(newRepo);
  repoTemplate(newRepo);
  });
}

function sortSources(data){

  $('#sources').on('click',function(event){

    if($(this).hasClass('active')){
  }else{
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
  }

    var newRepo =  _.filter(data, function(repo){
      if(repo.fork == false){
        return true;
      }else{
        return false;
      }
    });

    console.log(newRepo);
    repoTemplate(newRepo);

  });
}

function sortForks(data){

  $('#forks').on('click',function(event){
    if($(this).hasClass('active')){
  }else{
    $(this).siblings().removeClass('active');
    $(this).toggleClass('active');
  }

    var newRepo =  _.filter(data, function(repo){
      if(repo.fork == true){
        return true;
      }else{
        return false;
      }
    });

    console.log(newRepo);
    repoTemplate(newRepo);

  });
}

function repoTemplate(data){
  var source = $('#repo').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource({'repo': data});
  $('.repo').html(compiled);
}


function accountTemplate(data){
  var source = $('#login-name').html();
  var templateSource = handlebars.compile(source);
  var compiled = templateSource(data);
  $('.signed-in-as').html(compiled);
}


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



  $('.account-box').on('click',function(event){
    event.preventDefault();
    $('.sort-list').toggleClass('hide-it');
  });

  $('#profile').on('click', function(event){
    var newUrl =window.location.replace("https://github.com/gabepages");
    return newUrl;
  })
  $('#settings').on('click', function(event){
    var newUrl =window.location.replace("https://github.com/settings/profile");
    return newUrl;
  })

  $('#help').on('click', function(event){
    var newUrl =window.location.replace("https://help.github.com");
    return newUrl;
  })

  $('#explore').on('click', function(event){
    var newUrl =window.location.replace("https://github.com/explore");
    return newUrl;
  })

  $('#integrate').on('click', function(event){
    var newUrl =window.location.replace("https://github.com/integrations");
    return newUrl;
  })

  $('#stars').on('click', function(event){
    var newUrl =window.location.replace("https://github.com/stars");
    return newUrl;
  })
