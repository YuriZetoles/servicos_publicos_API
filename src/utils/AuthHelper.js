// src/utils/AuthHelper.js

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthHelper {
    static decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }

    static async hashPassword(password) {
        const saltRounds = parseInt(process.env.SALT_LENGTH) || 10;
        const hashed = await bcrypt.hash(password, saltRounds);
        return hashed;
    }

    static async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

export default AuthHelper;
