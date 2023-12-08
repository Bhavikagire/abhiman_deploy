
// models/QuestionSet.js
class QuestionSet {
    constructor(id, type, text, options = []) {
      this.id = id;
      this.type = type;
      this.text = text;
      this.options = options;
    }
  }
  
  module.exports = QuestionSet;
  