import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken';

/**
 * authenticate - middleware to authenticate users
 * @token : token to verify, from req.headers.authenticate
 */
export const authenticate = asyncHandler(async (req, res, next)=> {
    // Check if token is present in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from headers
            const token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (decode.user.code != undefined) {
                return res.status(401).json({error: "Unauthorize1"});
            }
            req.user = decode;
            
            next();

        } catch (error) {
            console.log(error)
            res.status(401).json({error: "Unauthorize"});
        };
    } else {
        res.status(401).json({error: "Unauthorize"})
    }
});
