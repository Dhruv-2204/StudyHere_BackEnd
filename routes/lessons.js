const express = require('express');
const { getDatabase } = require('../server');
const router = express.Router();

// Route to get all lessons
router.get('/lessons', async (req, res) => {
    try {
        const db = getDatabase();
        const lessons = await db.collection('lessons').find({}).toArray();
        res.json(lessons);
    } catch (err) {
        console.error('Error fetching lessons:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.end();
});

module.exports = router;