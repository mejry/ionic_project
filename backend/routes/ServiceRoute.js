const express = require('express');
const mongoose = require('mongoose');
const Service = require('../Models/ServiceModel');
const ServiceCategory = require('../Models/CategoryModel');

const router = express.Router();


router.post('/addservice', async (req, res) => {
    try {
        const { userId, diplome, description,categoryId } = req.body;
        console.log( userId, diplome, description );
        const category = await ServiceCategory.findById(categoryId);
        
        const service = new Service({
            user: [userId],  
            diplome,
            description
        });
       const result= await service.save();
        
        category.service.push(result._id);

        await category.save();
        
      
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.put('/confirm/:serviceId/category/:categoryId', async (req, res) => {
    try {
        const { serviceId, categoryId } = req.params;

       
        const category = await ServiceCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

     
        category.service.push(serviceId);
        await category.save();

        res.status(200).json({ message: 'Service confirmé et ajouté à la catégorie', category });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.delete('/cancel/:serviceId', async (req, res) => {
    try {
        const { serviceId } = req.params;


        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }

       
        await ServiceCategory.updateMany(
            { service: serviceId },
            { $pull: { service: serviceId } }
        );

        res.status(200).json({ message: 'Service annulé et supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
