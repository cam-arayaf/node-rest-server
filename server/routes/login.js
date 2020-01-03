const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/user');
const app = express();

app.post('/login', (req, resp) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) return resp.status(500).json({ ok: false, err });
        if (!userDB) return resp.status(400).json({ ok: false, error: { message: 'Incorrect (email) or password' } });
        if (!bcrypt.compareSync(body.password, userDB.password)) return resp.status(400).json({ ok: false, error: { message: 'Incorrect email or (password)' } });
        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        resp.json({ ok: true, user: userDB, token });
    });
});

module.exports = app;