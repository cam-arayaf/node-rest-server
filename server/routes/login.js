const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const express = require('express');
const User = require('../models/user');
const app = express();

const getCorrectResp = (userDB, resp) => {
    let token = jwt.sign({
        user: userDB
    }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
    resp.json({ ok: true, user: userDB, token });
}

const verify = async token => {
    const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
    const payload = ticket.getPayload();
    return { name: payload.name, email: payload.email, img: payload.picture, google: true }
}

app.post('/login', (req, resp) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userDB) => {
        const message = 'Incorrect email or password';
        if (err) return resp.status(500).json({ ok: false, err });
        if (!userDB) return resp.status(400).json({ ok: false, err: { message } });
        if (!bcrypt.compareSync(body.password, userDB.password)) return resp.status(400).json({ ok: false, err: { message } });
        getCorrectResp(userDB, resp);
    });
});

app.post('/google', async(req, resp) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(() => resp.status(403));
    if (googleUser.statusCode === 403) return resp.json({ ok: false, err: { message: 'Invalid token' } });
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) return resp.status(500).json({ ok: false, err });
        if (userDB) {
            if (!userDB.google) return resp.status(500).json({ ok: false, err: { message: 'You must use normal authentication' } });
            getCorrectResp(userDB, resp);
        } else {
            let user = new User({ name: googleUser.name, email: googleUser.email, img: googleUser.img, google: true, password: ':)' });
            user.save((err, userDB) => {
                if (err) return resp.status(500).json({ ok: false, err });
                getCorrectResp(userDB, resp);
            });
        }
    });
});

module.exports = app;