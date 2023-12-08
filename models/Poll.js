// models/Poll.js
class Poll {
    constructor(id, title, category, startDate, endDate, minReward, maxReward, questionSets = []) {
      this.id = id;
      this.title = title;
      this.category = category;
      this.startDate = startDate;
      this.endDate = endDate;
      this.minReward = minReward;
      this.maxReward = maxReward;
      this.questionSets = questionSets;
    }
  }
  
  module.exports = Poll;
  