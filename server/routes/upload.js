const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Product = require('../models/product');
const User = require('../models/user');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', (req, resp) => {
    let type = req.params.type;
    let id = req.params.id;

    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return resp.status(400).json({
            ok: false,
            err: { message: `Allowed types: ${ validTypes.join(', ') }`, type }
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return resp.status(400).json({ ok: false, err: { message: 'No files were uploaded' } });
    }

    let file = req.files.file;
    let fileSplitted = file.name.split('.');
    let extension = fileSplitted[fileSplitted.length - 1];
    let validExtensions = ['gif', 'jpg', 'jpeg', 'png'];

    if (validExtensions.indexOf(extension) < 0) {
        return resp.status(400).json({
            ok: false,
            err: { message: `Allowed extensions: ${ validExtensions.join(', ') }`, extension }
        });
    }

    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    file.mv(`uploads/${ type }/${ fileName }`, (err) => {
        if (err) return resp.status(500).json({ ok: false, err });
        type === 'users' ? fileUser(id, resp, fileName) : fileProduct(id, resp, fileName);
    });
});

const fileUser = (id, resp, fileName) => {
    User.findById(id, (err, userDB) => {
        if (!userDB) {
            deleteFile('users', fileName);
            return resp.status(400).json({ ok: false, err: { message: 'User not found' } });
        }
        if (err) {
            deleteFile('users', fileName);
            return resp.status(500).json({ ok: false, err });
        }
        deleteFile('users', userDB.img);
        userDB.img = fileName;
        userDB.save((err, userDB) => {
            resp.json({ ok: true, user: userDB });
        });
    });
}

const fileProduct = (id, resp, fileName) => {
    Product.findById(id, (err, productDB) => {
        if (!productDB) {
            deleteFile('products', fileName);
            return resp.status(400).json({ ok: false, err: { message: 'Product not found' } });
        }
        if (err) {
            deleteFile('products', fileName);
            return resp.status(500).json({ ok: false, err });
        }
        deleteFile('products', productDB.img);
        productDB.img = fileName;
        productDB.save((err, productDB) => {
            resp.json({ ok: true, product: productDB });
        });
    });
}

const deleteFile = (type, file) => {
    let pathFile = path.resolve(__dirname, `../../uploads/${ type }/${ file }`);
    if (fs.existsSync(pathFile)) fs.unlinkSync(pathFile);
}

module.exports = app;