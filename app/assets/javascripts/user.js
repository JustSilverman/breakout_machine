var user = {

  init: function(data){
    this.name = data.name;
    this.open_votes = data.open_votes;
    this.group = data.group;
    this.topicIds = data.topicIds;
    this.cohortId = data.cohortId;
    this.render();
    this.setBindings();
    table.updateForUser(user);
  },

  isTeacher: function() {
    return this.group == "teacher";
  },

  process: function(data) {
    if (data.message) {
      $('div.small-form h4').html(data.message).addClass("error");
      var errors = JST["templates/errors"]({errors: data.errors});
      $(".small-form ul").remove();
      $(".small-form h4").after(errors);
    } else {
      user.init(data);
    }
  },

  logout: function() {
    $.post('/sessions', {_method: "delete"}).done(function(){
      $(location).attr('href', "/");
    });
  },

  update: function(event, data) {
    user.open_votes = data.open_votes;
    user.topicIds = data.topicIds;
    user.render();
  },

  hasVotes: function() {
    return this.open_votes > 0
  },

  votedForTopic: function(id) {
    return $.inArray(id, this.topicIds) >= 0;
  },

  render: function() {
    var profile = JST["templates/profile"](this);
    $('.right-nav').html(profile);
  },

  listen: function() {
    $('table').on('vote', 'tr', this.update);
  },

  setBindings: function() {
    $('.top-nav').on('click', 'a.logout', function(e){
      e.preventDefault();
      user.logout();
    });

    if (pageCohort && pageCohort.id == this.cohortId) {
      $('div.cohort-nav').hide();
      $('#show-new-topic').show();

      $('#show-new-topic').on('click', function(e) {
        e.preventDefault();
        $('#show-new-topic').hide();
        $('#new-topic-form').show();
        $('input.topic-form-field').focus();
      });

    } else {
      $('div.cohort-nav').show();
      $('#show-new-topic').hide();
    }
  }
};