// const express = require('express');
const moment = require('moment');
const orderModel = require("../models/order");

require('../authentication/passport')


// Get paginated/sorted orders 
async function getOrders(req, res, next){
    try {
        const queryObject = { ...req.query }
        const checkKeys = ["sort", "page"];
        checkKeys.forEach((key) => delete queryObject[key]);
        
        // Querying based on URL Query Parameters
        let orderQuery = orderModel.find(queryObject);

        if(req.query.sort){
            orderQuery = orderQuery.sort(req.query.sort)
        }

        //  pagination
        let page = +req.query.page || 1
        const limit = 10
        const skip = (page - 1) * limit

        orderQuery.skip(skip).limit(limit)

        const orders = await orderQuery
        
    res.json({ status: true, orders })

    } catch (err) {
        next(err)
    }
}

// Create an Order  
async function createOrder(req, res, next){
    try {
    const body = req.body;

    const total_price = body.items.price * body.items.quantity

    const user_type = body.user_type

    const order = await orderModel.create({ 
        items: body.items,
        created_at: moment().toDate(),
        total_price,
        user_type
    })
    return res.json({ status: true, order })
    } catch (err) {
        next(err)
    }
}

// Find order by ID 
async function getOrderByID(req, res, next){
    try {
    const { Id } = req.params;
    const order = await orderModel.findById(Id)

    if (!order) {
        return res.status(404).json({ status: false, order: null })
    }

    return res.json({ status: true, order })
    } catch (err) {
        next(err)
    }
}

// Update Order State 
async function updateOrderState(req, res, next){
    try {
    const { id } = req.params;
    const { state } = req.body;

    const order = await orderModel.findById(id)

    if (!order) {
        return res.status(404).json({ status: false, order: null })
    }

    if (state < order.state) {
        return res.status(422).json({ status: false, order: null, message: 'Invalid operation' })
    }

    order.state = state;

    await order.save()

    return res.json({ status: true, order })
    } catch (err) {
        next(err)
    }
}

// Delete an order 
async function deleteOrder(req, res, next){
    try {
    const { id } = req.params;

    const order = await orderModel.deleteOne({ _id: id})

    return res.json({ status: true, order })
    } catch (err) {
        next(err)
    }
}


module.exports = {
    getOrders,
    createOrder,
    getOrderByID,
    updateOrderState,
    deleteOrder
}