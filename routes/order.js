const express = require("express");
const passport = require("passport");
const orderController = require("../Controllers/order");

require("../passport");
passport.initialize();

const orderRoute = express.Router();

// Get paginated/sorted orders
orderRoute.get("/", orderController.getOrders);

// Create an Order
orderRoute.post("/", orderController.createOrder);

// Find order by ID
orderRoute.get("/:id", orderController.getOrderByID);

// Update Order State
orderRoute.patch("/:id", orderController.updateOrderState);

// Delete an order
orderRoute.delete("/:id", orderController.deleteOrder);

module.exports = orderRoute;
