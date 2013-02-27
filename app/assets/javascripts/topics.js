$(document).ready(function(){
  $('#login').click(function(e){
    e.preventDefault();
    $('#signup-form').hide();
    $('#login-form').slideDown();
  });

  $('#signup').click(function(e){
    e.preventDefault();
    $('#login-form').hide();
    $('#signup-form').slideDown();
  });

  $('#show-new-topic').click(function(e){
    e.preventDefault();
    $('#show-new-topic').hide();
    $('#new-topic-form').show();
  });

  $('div#login-form form').submit(function(e){
    e.preventDefault();

    $.ajax({
      url:  this.action,
      type: this.method,
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data, status){
        $('div#login-form').slideUp();
        $('.nav-link').hide();
        $('.profile').show();
        $('.user-name').html(data.user.first_name + data.user.last_name);
        $('.votes-left').html(data.user.open_votes + " votes left today");
      }
    })
  });

  $('div#new-topic-form form').submit(function(e){
    e.preventDefault();

    $.ajax({
      url:  this.action,
      type: this.method,
      data: $(this).serialize(),
      dataType: 'json',
      success: function(data, status){
        $('div#new-topic-form').hide();
        $('#show-new-topic').show();

        //append new topic to list
      }
    })
  });

  $('.upvote').click(function(e){
    e.preventDefault();
    var topicId = $(this).attr('id').split("-")[1];

    $.ajax({
      url:  "topics/" + topicId,
      type: "post",
      data: {_method: 'put', id: topicId},
      dataType: 'json',
      success: function(data, status){
        var newTopicVotes = parseInt($("tr#topic-" + data.id + " td.vote-count").html()) + 1;
        $("tr#topic-" + data.id + " td.vote-count").html(newTopicVotes + " votes");

        var newUserVotes = parseInt($('.votes-left').html()) - 1;
        $('.votes-left').html(newUserVotes + " votes left today");
      }
    });
  });

    $('.downvote').click(function(e){
    e.preventDefault();
    var topicId = $(this).attr('id').split("-")[1];

      $.ajax({
        url:  "topics/" + topicId,
        type: "post",
        data: {_method: 'put', id: topicId},
        dataType: 'json',
        success: function(data, status){
          var newTopicVotes = parseInt($("tr#topic-" + data.id + " td.vote-count").html()) - 1;
          $("tr#topic-" + data.id + " td.vote-count").html(newTopicVotes + " votes");

          var newUserVotes = parseInt($('.votes-left').html()) + 1;
          $('.votes-left').html(newUserVotes + " votes left today");
        }
      });
    });
});