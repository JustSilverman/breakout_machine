function Topic(attrs) {
  for (var key in attrs) {
    this[key] = attrs[key];
  }
}

Topic.topics = [];

Topic.load = function(topics) {
  for (i=0; i < topics.length; i++) {
    var topicAttrs = topics[i];
    Topic.topics.push(new Topic(topicAttrs));
  }
}

Topic.find = function(id) {
  for (i in Topic.topics) {
    if (id == Topic.topics[i].id) {
      return Topic.topics[i];
    }
  }
}

Topic.sort = function() {

}

Topic.prototype.upvote = function() {
  this.votes ++;
}

Topic.prototype.downvote = function() {
  this.votes --;
}

Topic.prototype.render = function() {

}
