var user = {
  init: function(data){
    this.name = data.name;
    this.open_votes = data.open_votes;
    this.group = data.group;
    this.topicIds = data.topicIds;
    this.cohortId = data.cohortId;
    this.render();
    this.setBindings();
    this.listen();
    table.updateForUser(user);
  },

  isTeacher: function() {
    return this.group == "teacher";
  },

  signup: function(form) {
    var self = this;
    $.post(form.action, $(form).serialize()).done(function(data){
      self.processUser(data);
    });
  },

  login: function(form) {
    var self = this;
    $.post(form.action, $(form).serialize()).done(function(data){
      self.processUser(data);
    });
  },

  processUser: function(data) {
    if (data.message) {
      $('div.small-form h4').html(data.message).addClass("error");
      var errors = JST["templates/errors"]({errors: data.errors});
      $(".small-form ul").remove();
      $(".small-form h4").after(errors);
    } else {
      user.init(data);
      this.hideUserForms();
    }
  },

  hideUserForms: function() {
    $('div#login-form').slideUp();
    $('div#signup-form').slideUp();
    $('.nav-link').hide();
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

    $('.topic-list-body').on('click', '.upvote', function(e){
      e.preventDefault();
      if (user.hasVotes()) {
        table.findTopicByBtn($(this)).vote($(this));
      }
    });

    $('.topic-list-body').on('click', '.downvote', function(e){
      e.preventDefault();
      var id = $(this).parents(".topic-row").attr('data-id');
      if (user.votedForTopic(parseInt(id))) {
        table.findTopicByBtn($(this)).vote($(this));
      }
    });

    if (this.group == "teacher") {
      $('.topic-list-body').on('click', '.complete', function(e){
        e.preventDefault();
        table.findTopicByBtn($(this)).complete();
      });
    }
  }
};