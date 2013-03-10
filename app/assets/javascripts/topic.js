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
      table.render(false, user);
    });
  }
};

Topic.prototype.complete = function() {
  var self = this;
  $.post("topics/complete/" + this.id, {_method: 'put'}).done(function(data){
    if (data) {
      table.removeTopic(self.id);
      table.render(false, user);
    }
  });
};

Topic.prototype.update = function(data) {
  this.votes = data.votes;
  this.createdAt = data.createdAt;
  this.lastVote  = data.lastVote;
};