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

var user = {
  init: function(data){
    this.name = data.name;
    this.open_votes = data.open_votes;
    this.group = data.group;
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
    this.render();
  },

  hasVotes: function() {
    return this.open_votes > 0
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

    $('.topic-list-body').on('click', '.vote', function(e){
      e.preventDefault();
      if ($(this).attr('data-dir') == "down" || user.hasVotes()) {
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

function Topic(data) {
  this.id = data.id;
  this.title = data.title;
  this.votes = data.votes;
  this.createdAt = data.createdAt;
  this.lastVote =  data.lastVote;
};

Topic.prototype.vote = function($element) {
  var dir = $element.attr('data-dir');
  var self = this;
  if (dir == "up" || this.votes > 0) {
    $.post("topics/" + this.id, {_method: 'put', dir: dir}).done(function(data){
      self.update(data.topic);
      user.update(data.user);
      table.render(user);
    });
  }
};

Topic.prototype.complete = function() {
  var self = this;
  $.post("topics/complete/" + this.id, {_method: 'put'}).done(function(data){
    if (data) {
      table.removeTopic(self.id);
      table.render(user);
    }
  });
};

Topic.prototype.update = function(data) {
  this.votes = data.votes;
  this.createdAt = data.createdAt;
  this.lastVote  = data.lastVote;
};

var table = {
  topics: [],

  load: function(topics) {
    for (i in topics) {
      var topic = new Topic(topics[i]);
      this.addTopic(topic);
    }
  },

  addTopic: function(topic){
    this.topics.push(topic);
  },

  findTopicById: function(id) {
    for (i in this.topics) {
      if (this.topics[i].id == id) return this.topics[i];
    }
  },

  findTopicByBtn: function($row) {
    var id = $row.parent().parents(".topic-row").attr('data-id');
    return this.findTopicById(id);
  },

  removeTopic: function(id) {
    var topic = this.findTopicById(id);
    this.topics.splice(this.topics.indexOf(topic), 1);
  },

  sort: function() {
    this.topics = this.topics.sort(function(topic1, topic2){
      return topic2.votes - topic1.votes;
    });
  },

  render: function(user) {
    this.sort();
    var table = JST["templates/table"]({topics: this.topics});
    $(".topics-table").hide().fadeIn("slow").html(table);
    this.updateForUser(user);
  },

  updateForUser: function(user) {
    if (user) {
      if (user.hasVotes()) {
        $('span i.icon-hand-up').removeClass("disabled");
      } else {
        $('span i.icon-hand-up').addClass("disabled");
      };
      if (user.isTeacher()) {
        $('span i.icon-ok').removeClass("disabled");
      }
    }
  },

  createNewTopic: function(form) {
    var self = this;
    $.post(form.action, $(form).serialize()).done(function(data){
      var row = JST["templates/table"]({topics: [data]});
      $('.topics-table').append(row);
      self.updateForUser(user);
    });
    this.resetForm();
  },

  resetForm: function(){
    $('div#new-topic-form').hide();
    $('input#title').val("");
    $('#show-new-topic').show();
  },

  refresh: function(user, topics){
    this.topics = [];
    table.load(topics);
    table.render(user);
  }
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