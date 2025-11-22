const express = require('express');
const { getDatabase } = require('../server');
const router = express.Router();

// Route to get all orders
router.get('/orders', async (req, res) => {
    try {
        const db = getDatabase();
        const orders = await db.collection('orders').find({}).toArray();
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.end();
});

// Route to create a new order
router.post('/orders', async (req, res) => {
    try {
        const db = getDatabase();
        const newOrder = req.body;
        const result = await db.collection('orders').insertOne(newOrder);
        res.status(201).json({ message: 'Order created', orderId: result.insertedId });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.end();
});

// get order by name

router.get('/orders/:name', async (req, res) => {
    try {
        const db = getDatabase();
        const orderName = req.params.name;
        const order = await db.collection('orders').findOne({ name: orderName });
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ error: 'Order not found' });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    res.end();
});

module.exports = router;