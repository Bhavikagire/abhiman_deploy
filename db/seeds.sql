-- Insert sample polls
INSERT INTO polls (title, category, start_date, end_date, min_reward, max_reward) VALUES
('Sample Poll 1', 'Technology', '2023-01-01', '2023-01-10', 10, 50),
('Sample Poll 2', 'Science', '2023-02-01', '2023-02-15', 5, 30);

-- Insert sample questions for poll 1
INSERT INTO questions (poll_id, type, text) VALUES
(1, 'single', 'What is your favorite programming language?'),
(1, 'multiple', 'Which programming languages do you use?');

-- Insert sample options for question 1 of poll 1
INSERT INTO options (question_id, text) VALUES
(1, 'JavaScript'),
(1, 'Python'),
(1, 'Java'),
(1, 'C++');

-- Insert sample options for question 2 of poll 1
INSERT INTO options (question_id, text) VALUES
(2, 'JavaScript'),
(2, 'Python'),
(2, 'Java'),
(2, 'C++');
