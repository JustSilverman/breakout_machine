$(document).ready(function(){
  Topic.load(topics);

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

  $(document).on('click', 'a.logout', function(e){
    e.preventDefault();
    $.post('/sessions', {_method: "delete"}).done(function(){
      $(location).attr('href', "/");
    });
  });

  $('#show-new-topic').click(function(e){
    e.preventDefault();
    $('#show-new-topic').hide();
    $('#new-topic-form').show();
  });

  $('div#login-form form').submit(function(e){
    e.preventDefault();
    $('div#login-form').slideUp();
    $('.nav-link').hide();

    $.post(this.action, $(this).serialize()).done(function(data, status){
        $('.top-nav').append(data.profile);
    });
  });

  $('div#signup-form form').submit(function(e){
    e.preventDefault();
    $('div#signup-form').slideUp();
    $('.nav-link').hide();

    $.post(this.action, $(this).serialize()).done(function(data, status){
        $('.top-nav').append(data.profile);
    });
  });

  $('div#new-topic-form form').submit(function(e){
    e.preventDefault();
    $('div#new-topic-form').hide();
    $('#show-new-topic').show();

    $.post(this.action, $(this).serialize()).done(function(data, status){
      $('table.topics-table').append(data.topic_row);
      $('input#title').val("");
    });
  });

  $(document).on('click', '.vote', function(e){
    e.preventDefault();
    var topicId   = $(this).attr('data-dirta-id');
    var direction = $(this).attr('data-dir');
    $.post("topics/" + topicId, {_method: 'put', id: topicId, dir: direction}).done(function(data, status){
      $('div.topic-list-body table').replaceWith($(data.table).hide().fadeIn("slow"));
      $('.top-nav span.votes-left').replaceWith(data.votes);
    });
  });
});