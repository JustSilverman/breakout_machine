function Topic(data) {
  this.id = data.id;
  this.title = data.title;
  this.votes = data.votes;
  this.cohortId =  data.cohortId;
  this.cohortName =  data.cohortName;
  this.createdAt = data.createdAt;
  this.lastVote =  data.lastVote;
};

Topic.prototype.listen = function() {
  var self = this;

  // Throws an Uncaught TypeError: Object #<error> has no method 'apply'
  $(self.upvoteBtn()).on('ajax:success', function(event, data){
    self.row().trigger('vote', data);
  });
  $(self.downvoteBtn()).on('ajax:success', function(event, data){
    self.row().trigger('vote', data);
  });

  $(self.completeBtn()).on('ajax:success', function(event, data){
    if (data) self.row().trigger('complete', self.id);
  });
};

Topic.prototype.update = function(data) {
  this.votes = data.votes;
  this.createdAt = data.createdAt;
  this.lastVote  = data.lastVote;
};

Topic.prototype.attrs = function() {
  return {id: this.id, title: this.title, cohortName: this.cohortName, votes: this.votes, dateInfo: this.dateInfo()};
}

Topic.prototype.row = function() {
  return $("tr[data-id='" + this.id +"']");
};

Topic.prototype.icon = function(icon) {
  return $("tr[data-id='" + this.id +"']").find("span i." + icon);
};

Topic.prototype.anchor = function(icon) {
  return $("tr[data-id='" + this.id +"']").find("span i." + icon);
};

Topic.prototype.upvoteBtn = function() {
  return this.icon("icon-hand-up").parent('a');
};

Topic.prototype.downvoteBtn = function() {
  return this.icon("icon-hand-down").parent('a');
};

Topic.prototype.completeBtn = function() {
  return this.icon("icon-ok").parent('a');
};

Topic.prototype.dateInfo = function() {
  if (this.lastVote) {
    return "(created on " + this.createdAt + " | last upvote " +  this.lastVote + ")";
  } else {
    return "(created on " + this.createdAt + ")";
  }
}