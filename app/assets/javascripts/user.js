var user = {
  init: function(data){
    this.name = data.name;
    this.open_votes = data.open_votes;
    this.group = data.group;
    this.topic_ids = data.topic_ids;
    this.render();
    this.setBindings();
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

  update: function(data) {
    this.open_votes = data.open_votes;
    this.topic_ids = data.topic_ids;
    this.render();
  },

  hasVotes: function() {
    return this.open_votes > 0
  },

  votedForTopic: function(id) {
    return $.inArray(id, this.topic_ids) >= 0;
  },

  render: function() {
    var profile = JST["templates/profile"](this);
    $('.right-nav').html(profile);
  },

  setBindings: function() {
    $('.top-nav').on('click', 'a.logout', function(e){
      e.preventDefault();
      user.logout();
    });

    $('#show-new-topic').on('click', function(e) {
      e.preventDefault();
      $('#show-new-topic').hide();
      $('#new-topic-form').show();
      $('input.topic-form-field').focus();
    });

    $('div#new-topic-form form').on('submit', function(e){
      e.preventDefault();
      table.createNewTopic(this);
    });

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