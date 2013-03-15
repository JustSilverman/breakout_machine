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
    $('table').on('complete', 'tr', function(event, id){
      table.removeTopic(id);
      table.render();
    });

    $('table').on('vote', 'tr', function(event, data){
      table.findTopicById(data.topic.id).update(data.topic)
      table.render();
    });

    $('div#new-topic-form form').on('ajax:success', function(event, data){
      var newTopic = new Topic(data);
      table.addTopic(newTopic);
      $('table.topics-table').append($(JST["templates/row"](newTopic.attrs())));
      table.updateForUser();
      table.resetForm();
    });
  },

  render: function() {
    this.sort();
    $('table.topics-table').html("");
    for (i in this.topics) {
      $('table.topics-table').append($(JST["templates/row"](this.topics[i].attrs())));
      this.topics[i].listen();
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
        topics[i].upvoteBtn().on("click", true);
        topics[i].upvoteBtn().removeClass("disabled");
      } else {
        topics[i].icon("icon-hand-up").addClass("disabled");
        topics[i].upvoteBtn().on("click", false);
        topics[i].upvoteBtn().addClass("disabled");
      }
    }
  },

  updateDownVotes: function(topics) {
    for (i in topics) {
      if (!this.user.votedForTopic(topics[i].id)) {
        topics[i].icon("icon-hand-down").addClass("disabled");
        topics[i].downvoteBtn().on("click", false);
        topics[i].downvoteBtn().addClass("disabled");
      } else {
        topics[i].icon("icon-hand-down").removeClass("disabled");
        topics[i].downvoteBtn().on("click", true);
        topics[i].downvoteBtn().removeClass("disabled");
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
    $('#topic_title').val("");
    $('#show-new-topic').show();
  },
};