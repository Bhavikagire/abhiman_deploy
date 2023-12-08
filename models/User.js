// models/User.js
class User {
    constructor(id, name, votedPolls = []) {
      this.id = id;
      this.name = name;
      this.votedPolls = votedPolls;
    }
  }
  
  module.exports = User;
  