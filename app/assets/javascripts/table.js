var table = {
  topics: [],
  user: null,

  init: function(user, topics) {
    this.user = user;
    this.load(topics);
    this.listen();
    table.render(user);
  },

  refresh: function(user, topics){
    this.topics = [];
    this.init(user, topics);
  },

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

  removeTopic: function(event, id) {
    var topic = this.findTopicById(id);
    this.topics.splice(this.topics.indexOf(topic), 1);
  },

  sort: function() {
    this.topics = this.topics.sort(function(topic1, topic2){
      return topic2.votes - topic1.votes;
    });
  },

  listen: function() {
    $('span.complete a').on('ajax:success', function(){
      debugger
      table.removeTopic(id);
      table.render();
    });

    $('span.vote a').on('ajax:success', function(){
      debugger

    });

    $('div#new-topic-form form').on('ajax:success', function(event, data){
      topic = new Topic(data);
      $('table.topics-table').append($(JST["templates/row"](topic.attrs)));
      table.addTopic(topic);
      table.updateForUser();
      table.resetForm();
    });
  },

  render: function() {
    this.sort();
    for (i in this.topics) {
      var topic = this.topics[i];
      $('table.topics-table').append($(JST["templates/row"](topic.attrs)));
      topic.listen();
    }
    this.updateForUser();
  },

  updateForUser: function() {
    if (this.user) {
      this.updateUpVotes(this.topics);
      this.updateDownVotes(this.topics);
      this.updateComplete();
    }
  },

  updateUpVotes: function(topics) {
    for (i in topics) {
      if (this.user.hasVotes() && this.user.cohortId == topics[i].cohortId) {
        topics[i].icon("icon-hand-up").removeClass("disabled");
      } else {
        topics[i].icon("icon-hand-up").addClass("disabled");
      }
    }
  },

  updateDownVotes: function(topics) {
    for (i in topics) {
      if (!this.user.votedForTopic(topics[i].id)) {
        topics[i].icon("icon-hand-down").addClass("disabled");
      } else {
        topics[i].icon("icon-hand-down").removeClass("disabled");
      }
    }
  },

  updateComplete: function() {
    if (this.user.isTeacher()) {
      $('span i.icon-ok').removeClass("disabled");
    };
  },

  resetForm: function(){
    $('div#new-topic-form').hide();
    $('input#title').val("");
    $('#show-new-topic').show();
  },
};