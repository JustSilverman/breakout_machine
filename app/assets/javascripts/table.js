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
    $(".topics-table").html(table);
    this.updateForUser(user);
  },

  updateForUser: function(user) {
    if (user) {
      if (user.isTeacher()) {
        $('span i.icon-ok').removeClass("disabled");
      };
      this.updateUpVotes(user);
      this.updateDownVotes(user);
    }
  },

  updateUpVotes: function(user) {
    if(!user.hasVotes()) return $('span i.icon-hand-up').addClass("disabled");
    for (i in this.topics) {
      if (user.cohortId == this.topics[i].cohortId){
        this.topics[i].icon("icon-hand-up").removeClass("disabled");
      } else {
        this.topics[i].icon("icon-hand-up").addClass("disabled");
      }
    }
  },

  updateDownVotes: function(user) {
    for (i in this.topics) {
      if (!user.votedForTopic(this.topics[i].id)){
        this.topics[i].icon("icon-hand-down").addClass("disabled");
      } else {
        this.topics[i].icon("icon-hand-down").removeClass("disabled");
      }
    }
  },

  createNewTopic: function(form) {
    var self = this;
    $.post(form.action, $(form).serialize()).done(function(data){
      var row = JST["templates/table"]({topics: [data]});
      self.addTopic(new Topic(data));
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