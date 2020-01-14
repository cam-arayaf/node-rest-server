const express = require('express');
const _ = require('underscore');
const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const app = express();

app.get('/category', verifyToken, (req, resp) => {
    Category.find({}, 'description user').sort('description').populate('user', 'name email').exec((err, categoriesDB) => {
        if (categoriesDB.length === 0) return resp.status(400).json({ ok: false, err: { message: 'Categories not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        Category.countDocuments({}, (err, total) => {
            resp.json({ ok: true, total, categories: categoriesDB });
        });
    });
});

app.get('/category/:id', verifyToken, (req, resp) => {
    let id = req.params.id;
    Category.findById(id, 'description user').populate('user', 'name email').exec((err, categoryDB) => {
        if (!categoryDB) return resp.status(400).json({ ok: false, err: { message: 'Category not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, category: categoryDB });
    });
});

app.post('/category', verifyToken, (req, resp) => {
    let body = req.body;
    let category = new Category({ description: body.description, user: req.user._id });
    category.save((err, categoryDB) => {
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, category: categoryDB });
    });
});

app.put('/category/:id', verifyToken, (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['description']);
    Category.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoryDB) => {
        if (!categoryDB) return resp.status(400).json({ ok: false, err: { message: 'Category not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, category: categoryDB });
    });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, resp) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, { new: true }, (err, categoryDB) => {
        if (!categoryDB) return resp.status(400).json({ ok: false, err: { message: 'Category not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, category: categoryDB });
    });
});

module.exports = app;