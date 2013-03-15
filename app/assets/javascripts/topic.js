function Topic(data) {
  this.id = data.id;
  this.title = data.title;
  this.votes = data.votes;
  this.cohortId =  data.cohortId;
  this.cohortName =  data.cohortName;
  this.createdAt = data.createdAt;
  this.lastVote =  data.lastVote;
  this.attrs = {id: this.id, title: this.title, cohortName: this.cohortName, votes: this.votes, dateInfo: this.dateInfo()};
  this.listen();
};

Topic.prototype.listen = function() {
  var self = this;

  $(self.upvoteBtn()).on('ajax:success', function(event, data){
    debugger

  });

  $(self.downvoteBtn()).on('ajax:success', function(event, data){
    debugger

  });

  $(self.completeBtn()).on('ajax:success', function(event, data){
    debugger

  });
};

Topic.prototype.update = function(data) {
  this.votes = data.votes;
  this.createdAt = data.createdAt;
  this.lastVote  = data.lastVote;
};

Topic.prototype.row = function() {
  return $("tr[data-id='" + this.id +"']");
};

Topic.prototype.icon = function(icon) {
  return $("tr[data-id='" + this.id +"']").find("span i." + icon);
};

Topic.prototype.upvoteBtn = function(icon) {
  return this.icon("icon-hand-up").parent('a');
};

Topic.prototype.downvoteBtn = function(icon) {
  return this.icon("icon-hand-down").parent('a');
};

Topic.prototype.completeBtn = function(icon) {
  return this.icon("icon-hand-down").parent('a');
};

Topic.prototype.dateInfo = function() {
  if (this.lastVote) {
    return "(created on " + this.createdAt + " | last upvote " +  this.lastVote + ")";
  } else {
    return "(created on " + this.createdAt + ")";
  }
}