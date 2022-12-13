const express = require('express');
const passport = require('passport')
const orderController = require('../Controllers/order');

const orderRoute = express.Router()

// Get paginated/sorted orders 
orderRoute.get('/', orderController.getOrders);

// Create an Order
orderRoute.post('/', passport.authenticate('jwt', {session: false}), orderController.createOrder);

// Find order by ID
orderRoute.get('/:id',  orderController.getOrderByID);

// Update Order State
orderRoute.patch('/:id', passport.authenticate('jwt', {session: false}), orderController.updateOrderState);

// Delete an order
orderRoute.delete('/:id', passport.authenticate('jwt', {session: false}) ,orderController.deleteOrder);



module.exports = orderRoute