const express = require('express');
const app = express();

app.use(require('./category'));
app.use(require('./img'));
app.use(require('./login'));
app.use(require('./product'));
app.use(require('./upload'));
app.use(require('./user'));

module.exports = app;