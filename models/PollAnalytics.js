// models/PollAnalytics.js
class PollAnalytics {
    constructor(pollId, totalVotes = 0, optionCounts = {}) {
      this.pollId = pollId;
      this.totalVotes = totalVotes;
      this.optionCounts = optionCounts;
    }
  }
  
  module.exports = PollAnalytics;
  