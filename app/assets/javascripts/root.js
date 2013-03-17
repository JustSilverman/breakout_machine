$(document).ready(function(){
  var pageCohort = pageCohort;
  if (current_user) {
    user.init(current_user);
  } else {
    bindEntryForms();
  }
  table.init(user, topics);

  window.setInterval(poll, 5000);
});

function bindEntryForms() {
  $('a#login').on('ajax:success', function(){
    $('#signup-form').hide();
    $(".small-form ul").remove();
    $('div.small-form h4').removeClass("error").html("Login below");
    $('#login-form').slideDown();
  });

  $('a#signup').on('ajax:success', function(){
    $('#login-form').hide();
    $(".small-form ul").remove();
    $('div.small-form h4').removeClass("error").html("Signup below");
    $('#signup-form').slideDown();
  });

  $('div.small-form form').on('ajax:success', function(event, data){
    user.process(data);
    if (!data.message) {
      $('div#login-form').slideUp();
      $('div#signup-form').slideUp();
      $('.nav-link').hide();
    }
  });

  $('#show-new-topic').hide();
  $('.cohort-nav').hide();
};

function poll() {
  $.getJSON(location.pathname).done(function(data){
    table.refresh(user, data.topics);
  });
};