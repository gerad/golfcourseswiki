function CourseModel() {
  this.tees = [];
  this.distances = [];
  this.pars = { mens: [], womens: [] };
  this.handicaps = { mens: [], womens: [] };
};

CourseModel.prototype.addTeeAt = function(tee, index) {
  this.tees.splice(index, 0, tee);
  this.distances.splice(index, 0, []);
};

CourseModel.prototype.addTeeBefore = function(tee, nextTee) {
  this.addTeeAt(tee, this.tees.indexOf(nextTee));
}

CourseModel.prototype.addTeeAfter = function(tee, prevTee) {
  this.addTeeAt(tee, this.tees.indexOf(prevTee) + 1);
};

CourseModel.prototype.addTee = function(tee) {
  this.addTeeAt(tee, this.tees.length);
}

CourseModel.prototype.addTees = function(tees) {
  for (var i = 0, l = tees.length; i < l; ++i) {
    this.addTee(tees[i]);
  }
}

CourseModel.prototype.removeTeeAt = function(index) {
  this.tees.splice(index, 1);
  this.distances.splice(index, 1);
};

CourseModel.prototype.removeTee = function(tee) {
  this.removeTeeAt(this.tees.indexOf(tee));
};

module.exports = CourseModel;
