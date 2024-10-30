const express = require("express");
const mongoose = require("mongoose");
const Order = require("../Models/CommandeModel");
const Service =require("../Models/ServiceModel")
const router = express.Router();

router.post("/addcommande", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/service/:serviceId", async (req, res) => {
  try {
    const orders = await Order.find({ service: req.params.serviceId }).populate(
      "client"
    );
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("service").populate("client");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/getconfirmed/:userId", async (req, res) => {
    try {
      const orders = await Order.find({
        service: req.params.userId,
        status: "Confirmed",
      }).populate("client");
  
      console.log('Confirmed Orders from DB:', orders); // Check if this has any data
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching confirmed orders:', error);
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/getconfirmed/:userId", async (req, res) => {
    try {
      const orders = await Order.find({
        service: req.params.userId,
        status: "Confirmed",
      }).populate("client");
  
      console.log('Confirmed Orders from DB:', orders);
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching confirmed orders:', error);
      res.status(500).json({ error: error.message });
    }
  });
    
router.get('/pending/:userId', async (req, res) => {
    try {
        // Assuming 'userId' refers to the employee and 'service' is an array of their services
        const services = await Service.find({ user: req.params.userId }); // Fetch services for this employee
        const serviceIds = services.map(service => service._id); // Get the IDs of these services
        
        // Now find all pending orders related to these services
        const orders = await Order.find({ service: { $in: serviceIds }, status: 'Pending' }).populate('client');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put("/confirm/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
