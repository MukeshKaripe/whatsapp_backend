import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { Request, Response, NextFunction } from "express"
import User, { IUser } from "../models/UserModel";
import FancyError from "../utils/FancyError"


export interface JwtPayload {
    _id: string;
    iat: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: IUser;
    }
}

export const authMiddleware = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // let token;
    // if (req?.headers?.authorization?.startsWith("Bearer")) {
    //     token = req.headers.authorization.split(" ")[1]
    //     try {
    //         if (token) {
    //             const decode = jwt.verify(token, process.env.SECRET_KEY as jwt.Secret) as JwtPayload
    //             const user = await User.findById(decode._id)
    //             if (user !== null) {
    //                 req.user = user;
    //             }
    //             next();
    //         }
    //     } catch (error) {
    //         throw new FancyError('not Authorized token expired, please login again', 401)
    //     }
    // } else {
    //     throw new FancyError('No token attached to the header', 404)
    // }
    const { loginToken } = req.cookies
    try {
        const decode = jwt.verify(loginToken, process.env.SECRET_KEY as jwt.Secret) as JwtPayload
        const user = await User.findById(decode._id);
        if (user !== null) {
            req.user = user;
            next();
        }
    } catch (error) {
        throw new FancyError('not Authorized, token expired..!, please login again', 401)
    }
})

// export const isAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.user as IUser
//     const adminUser = await User.findOne({ email })
//     if (adminUser?.role !== "admin") {
//         throw new FancyError("You are not an admin", 401)
//     } else {
//         next();
//     }
// })

