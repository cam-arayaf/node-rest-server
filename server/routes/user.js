const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('underscore');
const User = require('../models/user');
const app = express();

app.get('/user', function(req, resp) {
    let skip = Number(req.query.skip) || 0;
    let limit = Number(req.query.limit) || 5;
    User.find({ state: true }, 'name email img role state google').skip(skip).limit(limit).exec((err, usersDB) => {
        if (err) return resp.status(400).json({ ok: false, err });
        User.countDocuments({ state: true }, (err, total) => {
            resp.json({ ok: true, total, usersDB })
        });
    });
});

app.post('/user', function(req, resp) {
    let body = req.body;
    if (!body.password) return resp.status(400).json({ ok: false, error: { message: 'Password is required' } });
    let user = new User({ name: body.name, email: body.email, password: bcrypt.hashSync(body.password, 10), role: body.role });
    user.save((err, userDB) => {
        if (err) return resp.status(400).json({ ok: false, err });
        resp.json({ ok: true, user: userDB });
    });
});

app.put('/user/:id', function(req, resp) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) return resp.status(400).json({ ok: false, err });
        resp.json({ ok: true, user: userDB });
    });
});

app.delete('/user/:id', function(req, resp) {
    let id = req.params.id;
    User.findByIdAndUpdate(id, { state: false }, { new: true }, (err, userDB) => {
        if (err) return resp.status(400).json({ ok: false, err });
        if (!userDB) return resp.status(400).json({ ok: false, error: { message: 'User not found' } });
        resp.json({ ok: true, user: userDB });
    });

    /*User.findByIdAndRemove(id, (err, userDB) => {
        if (err) return resp.status(400).json({ ok: false, err });
        if (!userDB) return resp.status(400).json({ ok: false, error: { message: 'User not found' } });
        resp.json({ ok: true, user: userDB });
    });*/
});

module.exports = app;