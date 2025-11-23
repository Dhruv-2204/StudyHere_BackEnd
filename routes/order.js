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

// POST /api/orders - Create new order
router.post('/orders', async (req, res) => {
    try {
        const { name, phone, lessons } = req.body;
        
        const db = getDatabase();

        // Check if all lessons still have enough spaces
        for (const item of lessons) {
            const lesson = await db.collection('lessons').findOne({ id: item.lessonId });
            if (!lesson || lesson.spaces < 1) {
                return res.status(400).json({ 
                    error: `Sorry, ${item.subject} is no longer available` 
                });
            }
        }
        
        const order = {
            name,
            phone,
            lessons,
            orderDate: new Date()
        };
        
        const result = await db.collection('orders').insertOne(order);
        res.status(201).json({ 
            message: 'Order created successfully', 
            orderId: result.insertedId 
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
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