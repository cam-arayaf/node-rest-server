const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('underscore');
const User = require('../models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const app = express();

app.get('/user', verifyToken, (req, resp) => {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;
    User.find({ state: true }, 'name email img role state google').skip(skip).limit(limit).sort('email').exec((err, usersDB) => {
        if (usersDB.length === 0) return resp.status(400).json({ ok: false, err: { message: 'Users not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        User.countDocuments({ state: true }, (err, total) => {
            resp.json({ ok: true, total, users: usersDB })
        });
    });
});

app.post('/user', [verifyToken, verifyAdminRole], (req, resp) => {
    let body = req.body;
    if (!body.password) return resp.status(400).json({ ok: false, err: { message: 'Password is required' } });
    let user = new User({ name: body.name, email: body.email, password: bcrypt.hashSync(body.password, 10), role: body.role });
    user.save((err, userDB) => {
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, user: userDB });
    });
});

app.put('/user/:id', [verifyToken, verifyAdminRole], (req, resp) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (!userDB) return resp.status(400).json({ ok: false, err: { message: 'User not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, user: userDB });
    });
});

app.delete('/user/:id', [verifyToken, verifyAdminRole], (req, resp) => {
    let id = req.params.id;
    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userDB) => {
        if (!userDB) return resp.status(400).json({ ok: false, err: { message: 'User not found' } });
        if (err) return resp.status(500).json({ ok: false, err });
        resp.json({ ok: true, user: userDB });
    });
});

module.exports = app;