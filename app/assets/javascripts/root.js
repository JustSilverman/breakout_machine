function poll() {
  $.getJSON("/topics").done(function(data){
    table.refresh(user, data.topics);
  });
};

$(document).ready(function(){
  if (current_user) {
    user.init(current_user);
  } else {
    bindEntryForms();
  }
  table.refresh(user, topics);

  window.setInterval(poll, 5000);
});

// Bind and reset login and signup forms if no user is logged in
// Sits outside of user, table and topic classes/objects
function bindEntryForms() {
  $('#login').click(function(e){
    e.preventDefault();
    $('#signup-form').hide();
    $(".small-form ul").remove();
    $('div.small-form h4').removeClass("error").html("Login below");
    $('#login-form').slideDown();
  });

  $('#signup').click(function(e){
    e.preventDefault();
    $('#login-form').hide();
    $(".small-form ul").remove();
    $('div.small-form h4').removeClass("error").html("Signup below");
    $('#signup-form').slideDown();
  });

  $('div#login-form form').submit(function(e){
    e.preventDefault();
    user.login(this);
  });

  $('div#signup-form form').submit(function(e){
    e.preventDefault();
    user.signup(this);
  });
};

// Refresh the table
function poll() {
  $.getJSON("/topics").done(function(data){
    table.refresh(user, data.topics);
  });
};