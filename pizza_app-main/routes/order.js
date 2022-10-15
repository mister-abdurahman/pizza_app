const express = require('express');
const moment = require('moment');

const orderRoute = express.Router()

const orderModel = require("../models/orderModel");
const { authenticate } = require('./authRoutes');


orderRoute.get('/', (req, res) => {
    async () => {
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

    }
})


orderRoute.post('/', async (req, res) => {
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
})

orderRoute.get('/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId)

    if (!order) {
        return res.status(404).json({ status: false, order: null })
    }

    return res.json({ status: true, order })
})

orderRoute.patch('/:id', async (req, res) => {
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
})

orderRoute.delete('/:id', async (req, res) => {
    const { id } = req.params;

    const order = await orderModel.deleteOne({ _id: id})

    return res.json({ status: true, order })
})


module.exports = orderRoute