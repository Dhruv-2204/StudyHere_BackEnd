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


// GET /api/search - Search lessons  https://studyhere-backend-1-1vqv.onrender.com/endpoint/search?q=m
router.get('/search', async (req, res) => {
    try {
        // const { q } = req.query;
        // const db = getDatabase();

        
        
        // const lessons = await db.collection('lessons').find({
        //     $or: [
        //         { subject: { $regex: q, $options: 'i' } },
        //         { location: { $regex: q, $options: 'i' } },
        //         { price: { $regex: q, $options: 'i' } },
        //         { spaces: { $regex: q, $options: 'i' } }
        //     ]
        // }).toArray();

        const { q } = req.query;
        const db = getDatabase();

        const query = [];
        query.push({ subject: { $regex: q, $options: 'i' } });
        query.push({ location: { $regex: q, $options: 'i' } });

        // Detect if q is numeric and query directly
        if (!isNaN(q)) {
            query.push({
                $expr: { $regexMatch: { input: { $toString: "$price" }, regex: q } }
            });
            query.push({
                $expr: { $regexMatch: { input: { $toString: "$spaces" }, regex: q } }
            });
        }


        const lessons = await db.collection('lessons').find({ $or: query }).toArray();
        
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});

// Aggregate functions
        // const q = req.query.q || '';
        // const lessons = await db.collection('lessons').aggregate([
        //   { $addFields: {
        //       priceStr: { $toString: '$price' },
        //       spacesStr: { $toString: '$spaces' }
        //     }
        //   },
        //   { $match: { $or: [
        //       { subject: { $regex: q, $options: 'i' } },
        //       { location: { $regex: q, $options: 'i' } },
        //       { priceStr: { $regex: q, $options: 'i' } },
        //       { spacesStr: { $regex: q, $options: 'i' } }
        //   ] } }
        // ]).toArray();

// PUT /api/lessons/:id - Update lesson (for spaces)
//  Need to add for other stuff too apart from spaces
router.put('/lessons/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const db = getDatabase();
        const result = await db.collection('lessons').updateOne(
            { id: parseInt(id) },
            { $set: updateData }
        );
        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ error: 'Lesson not found' });
        }
        
        res.json({ message: 'Lesson updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update lesson' });
        
    }
});

module.exports = router;