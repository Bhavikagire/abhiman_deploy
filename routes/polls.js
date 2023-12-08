const express = require('express');
const router = express.Router();
const pollService = require('../services/pollService');

const Poll = require('../models/Poll');
const QuestionSet = require('../models/QuestionSet');
const User = require('../models/User');
const PollAnalytics = require('../models/PollAnalytics');


// Sample data to simulate database
let poll = [];
let users = [];
let pollAnalytics = [];

const mysql = require('mysql2');

// Assuming you have a MySQL connection pool configured
const pool = mysql.createPool({
    host: 'DESKTOP-5RADR4U',        
    user: 'root',                    
    password: 'bhavika',       
    database: 'pollsinfo',  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Poll creation
router.post('/create', (req, res) => {
    const { title, category, start_date, end_date, min_reward, max_reward } = req.body;

    // Database function to insert the new poll
    pool.query(
        'INSERT INTO polls (title, category, start_date, end_date, min_reward, max_reward) VALUES (?, ?, ?, ?, ?, ?)',
        [title, category, start_date, end_date, min_reward, max_reward],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Failed to create a new poll' });
            } else {
                const newPoll = {
                    id: results.insertId,
                    title,
                    category,
                    start_date,
                    end_date,
                    min_reward,
                    max_reward,
                    questions: [],
                };
                polls.push(newPoll);
                res.json({ message: 'Poll created successfully', poll: newPoll });
            }
        }
    );
});

// Fetching all created polls
router.get('/all', (req, res) => {
    pool.query('SELECT * FROM polls', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Failed to fetch polls from the database' });
        } else {
            res.json({ polls: results });
        }
    });
});

// Updating a particular poll
router.put('/update/:pollId', (req, res) => {
    const { pollId } = req.params;
    const { title, category, min_reward, max_reward, start_date, end_date } = req.body;

    // Database function to update the poll
    pool.query(
        'UPDATE polls SET title = ?, category = ?, min_reward = ?, max_reward = ?, start_date = ?, end_date = ? WHERE id = ?',
        [title, category, min_reward, max_reward, start_date, end_date, pollId],
        (error, results) => {
            if (error || results.affectedRows === 0) {
                res.status(404).json({ error: 'Poll not found or failed to update' });
            } else {
                const updatedPoll = {
                    id: parseInt(pollId),
                    title,
                    category,
                    min_reward,
                    max_reward,
                    start_date,
                    end_date,
                };
                const pollIndex = polls.findIndex((poll) => poll.id === updatedPoll.id);
                if (pollIndex !== -1) {
                    polls[pollIndex] = updatedPoll;
                }
                res.json({ message: 'Poll updated successfully', poll: updatedPoll });
            }
        }
    );
});

// Fetching user polls and serving questions
router.get('/user/:userId', (req, res) => {
    const { userId } = req.params;
    const { start_date, end_date } = req.query;

    // Database function to fetch user polls
    pool.query(
        'SELECT * FROM polls WHERE id NOT IN (SELECT pollId FROM user_votes WHERE userId = ?) ' +
            'AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE)',
        [userId],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Failed to fetch user polls from the database' });
            } else {
                const userPolls = results;
                const currentQuestion = pollService.getNextQuestion(userId);
                res.json({ userPolls, currentQuestion });
            }
        }
    );
});

// Submitting a poll
router.post('/submit/:userId', (req, res) => {
    const { userId } = req.params;
    const { pollId, selectedOption } = req.body;

    // Database function to record the user's submission
    pool.query(
        'INSERT INTO user_votes (userId, pollId, selectedOption) VALUES (?, ?, ?)',
        [userId, pollId, selectedOption],
        (error) => {
            if (error) {
                res.status(500).json({ error: 'Failed to record the user\'s submission' });
            } else {
                const reward = pollService.calculateReward(userId, pollId, selectedOption, min_reward, max_reward);
                const analyticsUpdated = pollService.updatePollAnalytics(pollId, selectedOption);

                if (analyticsUpdated) {
                    res.json({ message: 'Poll submitted successfully', reward });
                } else {
                    res.status(500).json({ error: 'Failed to update poll analytics' });
                }
            }
        }
    );
});

// Fetching poll analytics for a particular poll
router.get('/analytics/:pollId', (req, res) => {
    const { pollId } = req.params;

    // Database function to fetch poll analytics
    const pollAnalyticData = pollAnalytics.find((analytic) => analytic.pollId === parseInt(pollId));

    res.json({ pollAnalytics: pollAnalyticData });
});

// Fetching overall poll analytics
router.get('/analytics/overall', (req, res) => {
    // Database function to fetch overall poll analytics
    const overallAnalytics = pollService.calculateOverallAnalytics(polls, pollAnalytics);

    res.json({ overallAnalytics });
});


/**
 * Function to calculate overall poll analytics.
 * @param {Array} polls - Array of all polls.
 * @param {Array} pollAnalytics - Array of poll analytics data.
 * @returns {Object} - Overall poll analytics.
 */
function calculateOverallAnalytics(polls, pollAnalytics) {
    // Initialize overall analytics data
    let overallAnalytics = {
        totalVotes: 0,
        optionCounts: {},
    };

    // Iterate through each poll and update overall analytics
    polls.forEach(poll => {
        // Find the poll's analytics data
        const pollAnalyticData = pollAnalytics.find(analytic => analytic.pollId === poll.id);

        // If analytics data exists, update overall counts
        if (pollAnalyticData) {
            overallAnalytics.totalVotes += pollAnalyticData.totalVotes;

            pollAnalyticData.options.forEach((option, index) => {
                const count = pollAnalyticData.optionCounts[index] || 0;
                overallAnalytics.optionCounts[option] = (overallAnalytics.optionCounts[option] || 0) + count;
            });
        }
    });

    return overallAnalytics;
}

module.exports = router;
