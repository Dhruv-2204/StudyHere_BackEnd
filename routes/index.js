const express = require('express');
const lessonsRouter = require('./lessons');
const ordersRouter = require('./order');

const router = express.Router();

// Route groups
router.use('/', lessonsRouter);
router.use('/', ordersRouter);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;