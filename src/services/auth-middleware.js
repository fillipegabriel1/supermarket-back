import jwt from 'jsonwebtoken';

const mid = (req, res, next) => {
    const noAuthRoutes = [
        "/api/user/login",
        "/api/user/register",
    ];

    if (
        req.originalUrl === "/api/user/login" ||
        req.originalUrl === "/api/user/register"
    ) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        next();
    });
};

export default mid;

