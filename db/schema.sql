-- Table for polls
CREATE TABLE polls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    min_reward INT NOT NULL,
    max_reward INT NOT NULL
);

-- Table for questions
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT,
    type VARCHAR(20) NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id)
);

-- Table for options
CREATE TABLE options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    text VARCHAR(255) NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Table for user data
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    reward INT DEFAULT 0,
    voting_history JSON DEFAULT '[]'
);

-- Table for poll analytics
CREATE TABLE poll_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    poll_id INT NOT NULL,
    options JSON NOT NULL,
    option_counts JSON NOT NULL,
    total_votes INT NOT NULL
);
