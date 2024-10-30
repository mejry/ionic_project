const express = require('express');
const mongoose = require('mongoose');
const ServiceCategory = require('../Models/CategoryModel');

const router = express.Router();



router.post('/addcategories', async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new ServiceCategory({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/getallcategories', async (req, res) => {
    try {
        const categories = await ServiceCategory.find();
        console.log(categories);
        
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/categories/:id', async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id).populate({
            path: "service",
            populate: {
                path: "user",
                select: "FirstName Gouvernerat LastName Username Adresse" 
            }
        });
        if (!category) return res.status(404).json({ message: 'Catégorie non trouvée' });
        console.log(category);
        
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/categories/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await ServiceCategory.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updatedCategory) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete('/categories/:id', async (req, res) => {
    try {
        const deletedCategory = await ServiceCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ message: 'Catégorie non trouvée' });
        res.status(204).send("category deleted avec succes ");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
