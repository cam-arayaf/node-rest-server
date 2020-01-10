const express = require('express');
const _ = require('underscore');
const Product = require('../models/product');
const { verifyToken } = require('../middlewares/authentication');
const app = express();

app.get('/product', verifyToken, (req, resp) => {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;
    Product
        .find({ available: true }, 'name price description available category user')
        .skip(skip)
        .limit(limit)
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if (productsDB.length === 0) return resp.status(400).json({ ok: false, err: { message: 'Products not found' } });
            if (err) return resp.status(500).json({ ok: false, err });
            Product.countDocuments({ available: true }, (err, total) => {
                resp.json({ ok: true, total, products: productsDB })
            });
        });
});

app.get('/product/:id', verifyToken, (req, resp) => {
    let id = req.params.id;
    Product
        .findById(id, 'name price description available category user')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDB) => {
            if (!productDB) return resp.status(400).json({ ok: false, err: { message: 'Product not found' } });
            if (err) return resp.status(500).json({ ok: false, err });
            resp.json({ ok: true, product: productDB })
        });
});

app.get('/product/search/:text', verifyToken, (req, resp) => {
    let regex = new RegExp(req.params.text, 'i');
    Product
        .find({ name: regex }, 'name price description available category user')
        .sort('name')
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if (productsDB.length === 0) return resp.status(400).json({ ok: false, err: { message: 'Products not found' } });
            if (err) return resp.status(500).json({ ok: false, err });
            Product.countDocuments({ name: regex }, (err, total) => {
                resp.json({ ok: true, total, products: productsDB })
            });
        });
});

app.post('/product', verifyToken, (req, resp) => {
    let body = req.body;
    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    });
    product.save((err, productDB) => {
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, product: productDB });
    });
});

app.put('/product/:id', verifyToken, (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'price', 'description', 'available', 'category']);
    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productDB) => {
        if (!productDB) return resp.status(400).json({ ok: false, err: { message: 'Product not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, product: productDB });
    });
});

app.delete('/product/:id', verifyToken, (req, resp) => {
    let id = req.params.id;
    Product.findByIdAndUpdate(id, { available: false }, { new: true }, (err, productDB) => {
        if (!productDB) return resp.status(400).json({ ok: false, err: { message: 'Product not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, product: productDB });
    });
});

module.exports = app;