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

  render: function() {
    this.sort();
    var table = JST["templates/table"]({topics: this.topics});
    $(".topics-table").html(table);
    this.updateForUser();
  },

  updateForUser: function() {
    if (this.user) {
      if (this.user.isTeacher()) {
        $('span i.icon-ok').removeClass("disabled");
      };
      this.updateUpVotes();
      this.updateDownVotes();
    }
  },

  listen: function() {
    $('table').on('complete', 'tr', function(event, id){
      table.removeTopic(id);
      table.render();
    });

    $('div#new-topic-form form').on('ajax:success', function(event, data){
      var row = JST["templates/table"]({topics: [data]});
      table.addTopic(new Topic(data));
      $('.topics-table').append(row);
      table.updateForUser();
      table.resetForm();
    });
  },

  updateUpVotes: function() {
    if(!this.user.hasVotes()) return $('span i.icon-hand-up').addClass("disabled");
    for (i in this.topics) {
      if (this.user.cohortId == this.topics[i].cohortId){
        this.topics[i].icon("icon-hand-up").removeClass("disabled");
      } else {
        this.topics[i].icon("icon-hand-up").addClass("disabled");
      }
    }
  },

  updateDownVotes: function() {
    for (i in this.topics) {
      if (!this.user.votedForTopic(this.topics[i].id)){
        this.topics[i].icon("icon-hand-down").addClass("disabled");
      } else {
        this.topics[i].icon("icon-hand-down").removeClass("disabled");
      }
    }
  },

  resetForm: function(){
    $('div#new-topic-form').hide();
    $('input#title').val("");
    $('#show-new-topic').show();
  },
};