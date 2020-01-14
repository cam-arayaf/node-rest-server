const jwt = require('jsonwebtoken');

const verifyJwt = (token, req, resp, next) => {
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) return resp.status(401).json({ ok: false, err });
        req.user = decoded.user;
        next();
    });
}

const verifyToken = (req, resp, next) => {
    verifyJwt(req.get('token'), req, resp, next);
}

const verifyTokenImg = (req, resp, next) => {
    verifyJwt(req.query.token, req, resp, next);
}

const verifyAdminRole = (req, resp, next) => {
    if (req.user.role !== 'ADMIN_ROLE') return resp.json({ ok: false, err: { message: 'The user is not an administrator' } });
    next();
}

module.exports = { verifyToken, verifyTokenImg, verifyAdminRole }