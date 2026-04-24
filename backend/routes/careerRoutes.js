const express = require('express');
const router = express.Router();
const Career = require('../models/Career');

// Get all active careers (Public)
router.get('/', async (req, res) => {
    try {
        const careers = await Career.find({ active: true }).sort({ created_at: -1 });
        res.json(careers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all careers (Admin - includes inactive)
router.get('/admin/all', async (req, res) => {
    try {
        const careers = await Career.find().sort({ created_at: -1 });
        res.json(careers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new career (Admin)
router.post('/', async (req, res) => {
    const career = new Career({
        title: req.body.title,
        department: req.body.department,
        location: req.body.location,
        type: req.body.type,
        salary: req.body.salary,
        tags: req.body.tags,
        description: req.body.description,
        active: req.body.active !== undefined ? req.body.active : true
    });

    try {
        const newCareer = await career.save();
        res.status(201).json(newCareer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a career (Admin)
router.put('/:id', async (req, res) => {
    try {
        const updatedCareer = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCareer) return res.status(404).json({ message: 'Job not found' });
        res.json(updatedCareer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a career (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const deletedCareer = await Career.findByIdAndDelete(req.params.id);
        if (!deletedCareer) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
