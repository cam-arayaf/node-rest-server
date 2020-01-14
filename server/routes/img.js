const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');
const app = express();

app.get('/image/:type/:img', verifyTokenImg, (req, resp) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${ req.params.type }/${ req.params.img }`);
    resp.sendFile(!fs.existsSync(pathImg) ? path.resolve(__dirname, '../assets/no-image.jpg') : pathImg);
});

module.exports = app;