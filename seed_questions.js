const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

const questions = [
    // SDE
    { text: 'Explain valid parentheses problem.', role: 'SDE', category: 'Data Structures & Algorithms', difficulty: 'Easy' },
    { text: 'Design a URL shortener.', role: 'SDE', category: 'System Design', difficulty: 'Medium' },
    { text: 'What is the difference between a process and a thread?', role: 'SDE', category: 'Operating Systems', difficulty: 'Medium' },

    // Frontend
    { text: 'Explain the concept of Virtual DOM in React.', role: 'Frontend Developer', category: 'React', difficulty: 'Medium' },
    { text: 'What are the differences between var, let, and const?', role: 'Frontend Developer', category: 'JavaScript', difficulty: 'Easy' },
    { text: 'How does the event loop work in JavaScript?', role: 'Frontend Developer', category: 'JavaScript', difficulty: 'Hard' },
    { text: 'What is semantic HTML?', role: 'Frontend Developer', category: 'HTML/CSS', difficulty: 'Easy' },

    // Backend
    { text: 'Explain the difference between SQL and NoSQL databases.', role: 'Backend Developer', category: 'Databases', difficulty: 'Medium' },
    { text: 'What is RESTful API design?', role: 'Backend Developer', category: 'APIs', difficulty: 'Medium' },
    { text: 'Describe the CAP theorem.', role: 'Backend Developer', category: 'System Design', difficulty: 'Hard' },

    // Cloud
    { text: 'What is Docker and how does it work?', role: 'Cloud Engineer', category: 'DevOps', difficulty: 'Medium' },
    { text: 'Explain the concept of Serverless computing.', role: 'Cloud Engineer', category: 'AWS', difficulty: 'Medium' },

    // Behavioral (All roles)
    { text: 'Tell me about a time you failed.', role: 'SDE', category: 'Behavioral', difficulty: 'Easy' },
    { text: 'Tell me about a time you failed.', role: 'Frontend Developer', category: 'Behavioral', difficulty: 'Easy' },
    { text: 'Tell me about a time you failed.', role: 'Backend Developer', category: 'Behavioral', difficulty: 'Easy' },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        await Question.deleteMany({}); // Clear existing
        await Question.insertMany(questions);

        console.log('Database seeded with questions!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
