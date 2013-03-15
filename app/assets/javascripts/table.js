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

  removeTopic: function(id) {
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
      for (i in this.topics) {
        this.updateUpVotes(this.topics[i]);
        this.updateDownVotes(this.topics[i]);
        this.topics[i].listen();
      }
      this.updateComplete();
    }
  },

  updateUpVotes: function(topic) {
    if (this.user.hasVotes() && this.user.cohortId == topic.cohortId) {
      topic.icon("icon-hand-up").removeClass("disabled");
      topic.upvoteBtn().on("click", true);
      topic.upvoteBtn().removeClass("disabled");
    } else {
      topic.icon("icon-hand-up").addClass("disabled");
      topic.upvoteBtn().on("click", false);
      topic.upvoteBtn().addClass("disabled");
    }
  },

  updateDownVotes: function(topic) {
    if (!this.user.votedForTopic(topic.id)) {
      topic.icon("icon-hand-down").addClass("disabled");
      topic.downvoteBtn().on("click", false);
      topic.downvoteBtn().addClass("disabled");
    } else {
      topic.icon("icon-hand-down").removeClass("disabled");
      topic.downvoteBtn().on("click", true);
      topic.downvoteBtn().removeClass("disabled");
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