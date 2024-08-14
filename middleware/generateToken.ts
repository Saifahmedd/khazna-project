import jwt from 'jsonwebtoken';

export const generateToken = (user: any) => {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
    return jwt.sign(user, secret, { expiresIn: '1d' });
};
